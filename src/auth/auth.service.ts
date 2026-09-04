import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Gender, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { USER_RELATIONS_INCLUDE, serializeUser } from '../common/serialize-user';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import * as crypto from 'crypto';

const BCRYPT_SALT_ROUNDS = 10;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // sliding 7-day window, renewed on every refresh

interface InMemoryUser {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  gender?: Gender;
  birthDate: Date;
  presence: 'online' | 'offline' | 'ghost';
  lastSeenAt: Date;
  noxCoinBalance: number;
  blockedUserIds: string[];
  mutedUserIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface InMemoryRefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
  revoked: boolean;
}

@Injectable()
export class AuthService {
  private inMemoryUsers: Map<string, InMemoryUser> = new Map();
  private inMemoryTokens: Map<string, InMemoryRefreshToken> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private omitPassword(user: InMemoryUser) {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  async signup(dto: SignupDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const birthDate = new Date(dto.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('Invalid birth date format. Use YYYY-MM-DD');
    }

    const age = this.calculateAge(birthDate);
    if (age < 13) {
      throw new BadRequestException(
        'User must be at least 13 years old to sign up for Noxchat.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    if (this.prisma.isConnected) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });

      if (existingUser) {
        throw new BadRequestException('Username is already taken.');
      }

      let user;
      try {
        user = await this.prisma.user.create({
          data: {
            username: dto.username,
            passwordHash,
            displayName: dto.displayName,
            gender: dto.gender,
            birthDate,
            noxCoinBalance: 100,
          },
          include: USER_RELATIONS_INCLUDE,
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          throw new BadRequestException('Username is already taken.');
        }
        throw err;
      }

      const tokens = await this.generateTokens(user.id, user.username);

      return {
        message: 'Signed up successfully',
        user: serializeUser(user),
        ...tokens,
      };
    } else {
      const existingUser = Array.from(this.inMemoryUsers.values()).find(
        (u) => u.username === dto.username,
      );

      if (existingUser) {
        throw new BadRequestException('Username is already taken.');
      }

      const id = crypto.randomUUID();
      const user: InMemoryUser = {
        id,
        username: dto.username,
        passwordHash,
        displayName: dto.displayName,
        gender: dto.gender,
        birthDate,
        presence: 'offline',
        lastSeenAt: new Date(),
        noxCoinBalance: 100,
        blockedUserIds: [],
        mutedUserIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryUsers.set(id, user);

      const tokens = await this.generateTokens(user.id, user.username);

      return {
        message: 'Signed up successfully',
        user: this.omitPassword(user),
        ...tokens,
      };
    }
  }

  async login(dto: LoginDto) {
    const invalidCredentials = () => new UnauthorizedException('Invalid username or password');

    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({
        where: { username: dto.username },
        include: USER_RELATIONS_INCLUDE,
      });

      if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
        throw invalidCredentials();
      }

      const tokens = await this.generateTokens(user.id, user.username);

      return {
        message: 'Logged in successfully',
        user: serializeUser(user),
        ...tokens,
      };
    } else {
      const user = Array.from(this.inMemoryUsers.values()).find(
        (u) => u.username === dto.username,
      );

      if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
        throw invalidCredentials();
      }

      const tokens = await this.generateTokens(user.id, user.username);

      return {
        message: 'Logged in successfully',
        user: this.omitPassword(user),
        ...tokens,
      };
    }
  }

  async refreshToken(dto: RefreshDto) {
    if (this.prisma.isConnected) {
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: dto.refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired. Please login again.');
      }

      // Conditional on revoked: false so only one of two concurrent requests using the
      // same token can win the rotation — the loser sees 0 rows updated, not a stale read.
      const rotated = await this.prisma.refreshToken.updateMany({
        where: { id: storedToken.id, revoked: false },
        data: { revoked: true },
      });

      if (rotated.count === 0) {
        throw new UnauthorizedException('Session expired. Please login again.');
      }

      return this.generateTokens(storedToken.user.id, storedToken.user.username);
    } else {
      const stored = this.inMemoryTokens.get(dto.refreshToken);

      if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired. Please login again.');
      }

      stored.revoked = true;

      const user = this.inMemoryUsers.get(stored.userId);
      const username = user ? user.username : '';

      return this.generateTokens(stored.userId, username);
    }
  }

  async logout(dto: LogoutDto) {
    if (this.prisma.isConnected) {
      await this.prisma.refreshToken.updateMany({
        where: { token: dto.refreshToken },
        data: { revoked: true },
      });
    } else {
      const stored = this.inMemoryTokens.get(dto.refreshToken);
      if (stored) {
        stored.revoked = true;
      }
    }

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, username: string) {
    const payload = { sub: userId, username };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    if (this.prisma.isConnected) {
      await this.prisma.refreshToken.create({
        data: {
          token: rawRefreshToken,
          userId,
          expiresAt,
        },
      });
    } else {
      this.inMemoryTokens.set(rawRefreshToken, {
        token: rawRefreshToken,
        userId,
        expiresAt,
        revoked: false,
      });
    }

    return {
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }
}
