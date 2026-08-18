import { IsArray, IsBoolean, IsOptional, IsString, ArrayMaxSize } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGhostModeDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ example: '22:00' })
  @IsOptional()
  @IsString()
  scheduleStart?: string;

  @ApiPropertyOptional({ example: '07:00' })
  @IsOptional()
  @IsString()
  scheduleEnd?: string;
}

export class UpdateWhitelistDto {
  @ApiPropertyOptional({ example: ['user-id-1', 'user-id-2'], description: 'Max 3 whitelisted user IDs' })
  @IsArray()
  @ArrayMaxSize(3, { message: 'Whitelist can contain at most 3 user IDs' })
  @IsString({ each: true })
  whitelistUserIds: string[];
}
