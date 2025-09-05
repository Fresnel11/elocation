import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, MinLength, Min, MaxLength, IsArray, IsUUID } from 'class-validator';

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
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: 'ID de la sous-catégorie',
    example: 'uuid-subcategory-id',
    required: false
  })
  @IsOptional()
  @IsUUID(4, { message: 'subCategoryId must be a valid UUID' })
  subCategoryId?: string;

  @ApiProperty({
    description: 'Nombre de chambres',
    example: 2,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiProperty({
    description: 'Nombre de salles de bain',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  bathrooms?: number;

  @ApiProperty({
    description: 'Surface en m²',
    example: 65,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  area?: number;

  @ApiProperty({
    description: 'Liste des équipements disponibles',
    example: ['wifi', 'tv', 'ac', 'kitchen'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({
    description: 'URLs des photos',
    example: ['photo1.jpg', 'photo2.jpg'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @ApiProperty({
    description: 'URL de la vidéo',
    example: 'video.mp4',
    required: false
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({
    description: 'Latitude de l\'annonce',
    example: 6.3703,
    required: false
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude de l\'annonce',
    example: 2.3912,
    required: false
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    description: 'Annonce disponible à la vente/location',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}