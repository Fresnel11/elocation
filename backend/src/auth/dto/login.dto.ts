import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email de l\'utilisateur (optionnel si phone fourni)',
    example: 'user@example.com',
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Numéro de téléphone (optionnel si email fourni)',
    example: '+22999154678',
    required: false,
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  password: string;
}