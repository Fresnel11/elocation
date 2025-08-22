import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, MinLength, Min, MaxLength } from 'class-validator';

export class CreateAdDto {
  @ApiProperty({
    description: 'Titre de l\'annonce',
    example: 'Appartement 3 pièces à vendre',
    minLength: 10,
    maxLength: 100
  })
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Description détaillée de l\'annonce',
    example: 'Bel appartement avec balcon, cuisine équipée, 2 chambres, salon, salle de bain complète. Idéalement situé près des commerces et transports.',
    minLength: 20,
    maxLength: 1000
  })
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Prix en FCFA',
    example: 25000000,
    minimum: 1000
  })
  @IsNumber()
  @Min(1000)
  price: number;

  @ApiProperty({
    description: 'Localisation de l\'annonce',
    example: 'Lomé, Togo - Quartier Akodessewa',
    minLength: 5,
    maxLength: 200
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  location: string;

  @ApiProperty({
    description: 'Numéro WhatsApp pour contact (format international)',
    example: '+22999154678',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  whatsappNumber: string;

  @ApiProperty({
    description: 'ID de la catégorie',
    example: 'uuid-category-id'
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'Annonce disponible à la vente/location',
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}