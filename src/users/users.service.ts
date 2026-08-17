import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateGhostModeDto, UpdateWhitelistDto } from './dto/ghost-mode.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
      },
    });
  }

  async getUserById(targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
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

  async blockUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot block yourself');
    }

    const user = await this.getMe(userId);
    const updatedBlocked = Array.from(new Set([...user.blockedUserIds, targetUserId]));

    return this.prisma.user.update({
      where: { id: userId },
      data: { blockedUserIds: updatedBlocked },
    });
  }

  async unblockUser(userId: string, targetUserId: string) {
    const user = await this.getMe(userId);
    const updatedBlocked = user.blockedUserIds.filter((id) => id !== targetUserId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { blockedUserIds: updatedBlocked },
    });
  }

  async muteUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot mute yourself');
    }

    const user = await this.getMe(userId);
    const updatedMuted = Array.from(new Set([...user.mutedUserIds, targetUserId]));

    return this.prisma.user.update({
      where: { id: userId },
      data: { mutedUserIds: updatedMuted },
    });
  }

  async updateGhostMode(userId: string, dto: UpdateGhostModeDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.enabled !== undefined && { ghostModeEnabled: dto.enabled }),
        ...(dto.scheduleStart !== undefined && { ghostScheduleStart: dto.scheduleStart }),
        ...(dto.scheduleEnd !== undefined && { ghostScheduleEnd: dto.scheduleEnd }),
      },
    });
  }

  async updateGhostWhitelist(userId: string, dto: UpdateWhitelistDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ghostWhitelist: dto.whitelistUserIds,
      },
    });
  }
}
