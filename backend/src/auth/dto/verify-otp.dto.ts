import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Numéro de téléphone associé au code OTP',
    example: '+22999154678',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (+22999154678)'
  })
  phone: string;

  @ApiProperty({
    description: 'Code OTP à 6 chiffres reçu par SMS',
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


