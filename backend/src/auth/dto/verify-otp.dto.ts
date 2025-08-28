import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email associé au code OTP',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Code OTP à 6 chiffres reçu par email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    pattern: '^\\d{6}$'
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, {
    message: 'Le code OTP doit contenir exactement 6 chiffres'
  })
  code: string;
}


