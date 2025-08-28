import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'user@example.com',
    maxLength: 100
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  password: string;
}