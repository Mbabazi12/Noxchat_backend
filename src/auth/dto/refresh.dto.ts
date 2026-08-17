import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({ example: 'your-refresh-token-here' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
