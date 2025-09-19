import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MinLength, MaxLength, IsArray, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({
    description: 'Titre de la demande',
    example: 'Recherche appartement 2 pièces à Cotonou',
    minLength: 10,
    maxLength: 100
  })
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Description détaillée de la demande',
    example: 'Je recherche un appartement meublé, proche des transports...',
    minLength: 20,
    maxLength: 1000
  })
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Localisation souhaitée',
    example: 'Cotonou',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  location: string;

  @ApiProperty({
    description: 'Budget maximum en FCFA',
    example: 150000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  maxBudget?: number;

  @ApiProperty({
    description: 'Nombre de chambres minimum',
    example: 2,
    required: false
  })
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @ApiProperty({
    description: 'Nombre de salles de bain minimum',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @ApiProperty({
    description: 'Surface minimum en m²',
    example: 50,
    required: false
  })
  @IsOptional()
  @IsNumber()
  minArea?: number;

  @ApiProperty({
    description: 'ID de la catégorie',
    example: 'uuid-category-id'
  })
  @IsString()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Équipements/options souhaités',
    example: ['wifi', 'parking', 'climatisation'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  desiredAmenities?: string[];
}