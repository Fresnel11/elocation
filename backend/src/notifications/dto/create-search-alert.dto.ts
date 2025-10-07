import { IsString, IsOptional, IsNumber, IsUUID, Min, Max } from 'class-validator';

export class CreateSearchAlertDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  bathrooms?: number;
}