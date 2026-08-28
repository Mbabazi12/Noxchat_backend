import { IsOptional, IsString, IsUrl, IsEnum, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'alex_nox',
    description: '3-20 characters, lowercase letters, numbers and underscores only',
  })
  @IsOptional()
  @Matches(/^[a-z0-9_]{3,20}$/, {
    message: 'Username must be 3-20 characters: lowercase letters, numbers and underscores only',
  })
  username?: string;

  @ApiPropertyOptional({ example: 'Alex Nox' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Living life on Noxchat!' })
  @IsOptional()
  @IsString()
  bio?: string;
}
