import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Code OTP reçu par email',
    example: '123456'
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Nouveau mot de passe',
    example: 'newPassword123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}