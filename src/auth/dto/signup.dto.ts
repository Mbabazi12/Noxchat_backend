import { IsNotEmpty, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'alex@example.com', description: 'User email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2000-01-15', description: 'Birth date (YYYY-MM-DD), minimum age 13' })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;
}
