import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'Jean',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Cossou',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'Numéro de téléphone (format international)',
    example: '+22999154678',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (+22999154678)'
  })
  phone: string;

  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'jean.cossou@example.com',
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;



  @ApiProperty({
    description: 'Photo de profil (URL)',
    example: 'https://example.com/profile.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({
    description: 'Date de naissance',
    example: '1990-01-01',
    required: false
  })
  @IsOptional()
  @IsString()
  birthDate?: string;
}