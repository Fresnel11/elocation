import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({
    description: 'Numéro de téléphone pour recevoir le code OTP',
    example: '+22999154678',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (+22999154678)'
  })
  phone: string;
}


