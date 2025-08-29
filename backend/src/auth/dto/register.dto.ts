import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, Matches, IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
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
    pattern: '^\\+[1-9]\\d{1,14}$',
    minLength: 10,
    maxLength: 15
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (+22999154678)'
  })
  phone: string;

  @ApiProperty({
    description: 'Email de l\'utilisateur (optionnel)',
    example: 'jean.cossou@example.com',
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Mot de passe (minimum 6 caractères)',
    example: 'password123',
    minLength: 6,
    maxLength: 100
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    example: UserRole.TENANT
  })
  @IsEnum(UserRole)
  role: UserRole;
}