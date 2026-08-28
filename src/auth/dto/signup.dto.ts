import { IsNotEmpty, IsOptional, IsDateString, IsString, IsEnum, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class SignupDto {
  @ApiProperty({
    example: 'alex_nox',
    description: 'Unique handle: 3-20 characters, lowercase letters, numbers and underscores only',
  })
  @IsNotEmpty()
  @Matches(/^[a-z0-9_]{3,20}$/, {
    message: 'Username must be 3-20 characters: lowercase letters, numbers and underscores only',
  })
  username: string;

  @ApiProperty({ example: 'Alex Nox', description: 'Full display name' })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({ example: '2000-01-15', description: 'Birth date (YYYY-MM-DD), minimum age 13' })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: 'correct-horse-battery-staple', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiProperty({ example: 'correct-horse-battery-staple', description: 'Must match password' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Optional — not required to sign up' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
