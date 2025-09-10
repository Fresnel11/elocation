import { IsString, IsOptional, IsNumber, IsArray, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  maxBudget?: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  minArea?: number;

  @IsOptional()
  @IsArray()
  desiredAmenities?: string[];

  @IsUUID()
  categoryId: string;

  // Champs génériques pour différentes catégories
  @IsOptional()
  @IsString()
  desiredBrand?: string;

  @IsOptional()
  @IsString()
  desiredModel?: string;

  @IsOptional()
  @IsNumber()
  minYear?: number;

  @IsOptional()
  @IsString()
  desiredCondition?: string;

  @IsOptional()
  @IsString()
  desiredColor?: string;

  @IsOptional()
  @IsString()
  desiredFuel?: string;

  @IsOptional()
  @IsString()
  desiredTransmission?: string;

  @IsOptional()
  @IsNumber()
  maxMileage?: number;

  @IsOptional()
  @IsString()
  desiredSize?: string;

  @IsOptional()
  @IsArray()
  desiredFeatures?: string[];
}