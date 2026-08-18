import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateGhostModeDto, UpdateWhitelistDto } from './dto/ghost-mode.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current logged-in user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  async getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile (displayName, avatarUrl, bio)' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.id, dto);
  }

  @Patch('me/ghost-mode')
  @ApiOperation({ summary: 'Enable/disable ghost mode and set schedule' })
  @ApiResponse({ status: 200, description: 'Ghost mode updated' })
  async updateGhostMode(@Req() req: any, @Body() dto: UpdateGhostModeDto) {
    return this.usersService.updateGhostMode(req.user.id, dto);
  }

  @Patch('me/ghost-mode/whitelist')
  @ApiOperation({ summary: 'Set up to 3 users whitelisted to still see real online status in ghost mode' })
  @ApiResponse({ status: 200, description: 'Whitelist updated' })
  async updateGhostWhitelist(@Req() req: any, @Body() dto: UpdateWhitelistDto) {
    return this.usersService.updateGhostWhitelist(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public profile of another user' })
  @ApiResponse({ status: 200, description: 'Public profile returned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post(':id/block')
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({ status: 200, description: 'User blocked' })
  async blockUser(@Req() req: any, @Param('id') id: string) {
    return this.usersService.blockUser(req.user.id, id);
  }

  @Delete(':id/block')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({ status: 200, description: 'User unblocked' })
  async unblockUser(@Req() req: any, @Param('id') id: string) {
    return this.usersService.unblockUser(req.user.id, id);
  }

  @Post(':id/mute')
  @ApiOperation({ summary: 'Mute notifications from a user' })
  @ApiResponse({ status: 200, description: 'User muted' })
  async muteUser(@Req() req: any, @Param('id') id: string) {
    return this.usersService.muteUser(req.user.id, id);
  }
}
