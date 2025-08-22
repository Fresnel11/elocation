import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, MaxLength, IsUUID, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price: number;

  @IsString()
  location: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @MaxLength(5, { each: true })
  photos?: string[];

  @IsOptional()
  @IsString()
  whatsappNumber?: string;
}