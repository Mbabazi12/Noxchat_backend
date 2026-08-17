import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import * as crypto from 'crypto';

interface InMemoryUser {
  id: string;
  email: string;
  displayName: string;
  birthDate: Date;
  presence: 'online' | 'offline' | 'ghost';
  lastSeenAt: Date;
  noxCoinBalance: number;
  blockedUserIds: string[];
  mutedUserIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface InMemoryOtp {
  email: string;
  code: string;
  birthDate?: Date;
  expiresAt: Date;
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
  private inMemoryOtps: InMemoryOtp[] = [];
  private inMemoryTokens: Map<string, InMemoryRefreshToken> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

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

  private generateOtpCode(): string {
    return process.env.NODE_ENV === 'production'
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456';
  }

  private buildOtpResponse(email: string, code: string) {
    return {
      message: 'OTP sent successfully',
      email,
      ...(process.env.NODE_ENV !== 'production' && { otp: code }),
    };
  }

  async signup(dto: SignupDto) {
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

    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (this.prisma.isConnected) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email is already registered. Please login.');
      }

      await this.prisma.otpCode.create({
        data: {
          email: dto.email,
          code,
          birthDate,
          expiresAt,
        },
      });
    } else {
      const existingUser = Array.from(this.inMemoryUsers.values()).find(
        (u) => u.email === dto.email,
      );

      if (existingUser) {
        throw new BadRequestException('Email is already registered. Please login.');
      }

      this.inMemoryOtps.push({
        email: dto.email,
        code,
        birthDate,
        expiresAt,
      });
    }

    await this.mailService.sendOtpEmail(dto.email, code);

    return this.buildOtpResponse(dto.email, code);
  }

  async login(dto: LoginDto) {
    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new NotFoundException('Account not found with this email. Please sign up first.');
      }

      await this.prisma.otpCode.create({
        data: {
          email: dto.email,
          code,
          expiresAt,
        },
      });
    } else {
      const user = Array.from(this.inMemoryUsers.values()).find(
        (u) => u.email === dto.email,
      );

      if (!user) {
        throw new NotFoundException('Account not found with this email. Please sign up first.');
      }

      this.inMemoryOtps.push({
        email: dto.email,
        code,
        expiresAt,
      });
    }

    await this.mailService.sendOtpEmail(dto.email, code);

    return this.buildOtpResponse(dto.email, code);
  }

  async verifyOtp(dto: VerifyOtpDto) {
    if (this.prisma.isConnected) {
      const validOtp = await this.prisma.otpCode.findFirst({
        where: {
          email: dto.email,
          code: dto.code,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!validOtp) {
        throw new UnauthorizedException('Invalid or expired OTP code');
      }

      let user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        if (!validOtp.birthDate) {
          throw new BadRequestException('Birth date is required for new user registration');
        }

        user = await this.prisma.user.create({
          data: {
            email: dto.email,
            displayName: dto.displayName || `User_${dto.email.split('@')[0]}`,
            birthDate: validOtp.birthDate,
            noxCoinBalance: 100,
          },
        });
      }

      await this.prisma.otpCode.deleteMany({
        where: { email: dto.email },
      });

      const tokens = await this.generateTokens(user.id, user.email);

      return {
        message: 'OTP verified successfully',
        user,
        ...tokens,
      };
    } else {
      const otpIdx = this.inMemoryOtps.findIndex(
        (o) => o.email === dto.email && o.code === dto.code && o.expiresAt >= new Date(),
      );

      if (otpIdx === -1) {
        throw new UnauthorizedException('Invalid or expired OTP code');
      }

      const validOtp = this.inMemoryOtps[otpIdx];

      let user = Array.from(this.inMemoryUsers.values()).find(
        (u) => u.email === dto.email,
      );

      if (!user) {
        if (!validOtp.birthDate) {
          throw new BadRequestException('Birth date is required for new user registration');
        }

        const id = crypto.randomUUID();
        user = {
          id,
          email: dto.email,
          displayName: dto.displayName || `User_${dto.email.split('@')[0]}`,
          birthDate: validOtp.birthDate,
          presence: 'offline',
          lastSeenAt: new Date(),
          noxCoinBalance: 100,
          blockedUserIds: [],
          mutedUserIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        this.inMemoryUsers.set(id, user);
      }

      this.inMemoryOtps.splice(otpIdx, 1);

      const tokens = await this.generateTokens(user.id, user.email);

      return {
        message: 'OTP verified successfully',
        user,
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
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      const tokens = await this.generateTokens(storedToken.user.id, storedToken.user.email);

      return tokens;
    } else {
      const stored = this.inMemoryTokens.get(dto.refreshToken);

      if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      stored.revoked = true;

      const user = this.inMemoryUsers.get(stored.userId);
      const email = user ? user.email : '';

      const tokens = await this.generateTokens(stored.userId, email);

      return tokens;
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

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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
