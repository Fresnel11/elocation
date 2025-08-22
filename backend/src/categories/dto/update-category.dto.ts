import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nom de la catégorie',
    example: 'Immobilier',
    minLength: 2,
    maxLength: 50,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: 'Description de la catégorie',
    example: 'Annonces immobilières : appartements, maisons, terrains à vendre ou à louer',
    minLength: 10,
    maxLength: 200,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  description?: string;

  @ApiProperty({
    description: 'Icône de la catégorie (emoji ou nom d\'icône)',
    example: '🏠',
    required: false
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Couleur de la catégorie (code hexadécimal)',
    example: '#3B82F6',
    required: false
  })
  @IsOptional()
  @IsString()
  color?: string;
}