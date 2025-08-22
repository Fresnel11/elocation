import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(3)
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}