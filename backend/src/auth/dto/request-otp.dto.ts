import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({
    description: 'Email pour recevoir le code OTP',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;
}


