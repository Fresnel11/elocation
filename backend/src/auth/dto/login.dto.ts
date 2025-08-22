import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf(o => !o.phone)
  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf(o => !o.email)
  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  password: string;
}