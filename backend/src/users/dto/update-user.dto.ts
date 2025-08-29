import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, Matches, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'Jean',
    minLength: 2,
    maxLength: 50,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Cossou',
    minLength: 2,
    maxLength: 50,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiProperty({
    description: 'Numéro de téléphone (format international)',
    example: '+22999154678',
    pattern: '^\\+[1-9]\\d{1,14}$',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (+22999154678)'
  })
  phone?: string;

  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'jean.cossou@example.com',
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur',
    example: 'password123',
    minLength: 6,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    example: 'USER',
    enum: UserRole,
    required: false
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'Statut actif de l\'utilisateur',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

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