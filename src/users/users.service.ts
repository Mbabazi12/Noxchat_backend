import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { USER_RELATIONS_INCLUDE, serializeUser } from '../common/serialize-user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateGhostModeDto, UpdateWhitelistDto } from './dto/ghost-mode.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: USER_RELATIONS_INCLUDE,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return serializeUser(user);
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.username && { username: dto.username }),
          ...(dto.displayName && { displayName: dto.displayName }),
          ...(dto.gender !== undefined && { gender: dto.gender }),
          ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
          ...(dto.bio !== undefined && { bio: dto.bio }),
        },
        include: USER_RELATIONS_INCLUDE,
      });
      return serializeUser(user);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Username is already taken.');
      }
      throw err;
    }
  }

  async getUserById(targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        presence: true,
        lastSeenAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async assertUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async blockUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot block yourself');
    }

    await this.assertUserExists(targetUserId);

    await this.prisma.block.upsert({
      where: { userId_targetUserId: { userId, targetUserId } },
      create: { userId, targetUserId },
      update: {},
    });

    return this.getMe(userId);
  }

  async unblockUser(userId: string, targetUserId: string) {
    await this.prisma.block.deleteMany({ where: { userId, targetUserId } });
    return this.getMe(userId);
  }

  async muteUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot mute yourself');
    }

    await this.assertUserExists(targetUserId);

    await this.prisma.mute.upsert({
      where: { userId_targetUserId: { userId, targetUserId } },
      create: { userId, targetUserId },
      update: {},
    });

    return this.getMe(userId);
  }

  async updateGhostMode(userId: string, dto: UpdateGhostModeDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.enabled !== undefined && { ghostModeEnabled: dto.enabled }),
        ...(dto.scheduleStart !== undefined && { ghostScheduleStart: dto.scheduleStart }),
        ...(dto.scheduleEnd !== undefined && { ghostScheduleEnd: dto.scheduleEnd }),
      },
      include: USER_RELATIONS_INCLUDE,
    });
    return serializeUser(user);
  }

  async updateGhostWhitelist(userId: string, dto: UpdateWhitelistDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ghostWhitelist: dto.whitelistUserIds,
      },
      include: USER_RELATIONS_INCLUDE,
    });
    return serializeUser(user);
  }
}
