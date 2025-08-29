import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, IsUUID, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchAdsDto extends PaginationDto {
  @ApiProperty({
    description: 'Recherche textuelle dans le titre et la description',
    example: 'appartement lomé',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'ID de la catégorie pour filtrer',
    example: 'uuid-category-id',
    required: false
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: 'Prix minimum en FCFA',
    example: 1000000,
    required: false,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Prix maximum en FCFA',
    example: 50000000,
    required: false,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Localisation pour filtrer',
    example: 'Lomé',
    required: false
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Filtrer par disponibilité',
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Numéro de page pour la pagination',
    example: 1,
    default: 1,
    required: false,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Nombre d\'éléments par page',
    example: 10,
    default: 10,
    required: false,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    description: 'Champ de tri',
    example: 'createdAt',
    enum: ['createdAt', 'price', 'title', 'location'],
    required: false
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'price' | 'title' | 'location';

  @ApiProperty({
    description: 'Ordre de tri',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    required: false
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}