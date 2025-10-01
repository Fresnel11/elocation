import { IsString, IsOptional, IsNumber, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty({ description: 'Message de réponse' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Prix proposé' })
  @IsOptional()
  @IsNumber()
  proposedPrice?: number;

  @ApiProperty({ description: 'Téléphone de contact' })
  @IsString()
  contactPhone: string;

  @ApiPropertyOptional({ description: 'Email de contact' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Date de disponibilité' })
  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @ApiPropertyOptional({ description: 'Images de la réponse' })
  @IsOptional()
  @IsArray()
  images?: string[];
}