import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email pour recevoir le code OTP de réinitialisation',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;
}