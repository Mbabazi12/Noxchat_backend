import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'alex_nox' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'correct-horse-battery-staple' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
