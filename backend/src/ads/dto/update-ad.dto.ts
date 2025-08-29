import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, MinLength, Min, MaxLength } from 'class-validator';

export class UpdateAdDto {
  @ApiProperty({
    description: 'Titre de l\'annonce',
    example: 'Appartement 3 pièces à vendre',
    minLength: 10,
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Description détaillée de l\'annonce',
    example: 'Bel appartement avec balcon, cuisine équipée, 2 chambres, salon, salle de bain complète.',
    minLength: 20,
    maxLength: 1000,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Prix en FCFA',
    example: 25000000,
    minimum: 1000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  price?: number;

  @ApiProperty({
    description: 'Localisation de l\'annonce',
    example: 'Lomé, Togo - Quartier Akodessewa',
    minLength: 5,
    maxLength: 200,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  location?: string;

  @ApiProperty({
    description: 'Numéro WhatsApp pour contact (format international)',
    example: '+22999154678',
    pattern: '^\\+[1-9]\\d{1,14}$',
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  whatsappNumber?: string;

  @ApiProperty({
    description: 'ID de la catégorie',
    example: 'uuid-category-id',
    required: false
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Annonce disponible à la vente/location',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}