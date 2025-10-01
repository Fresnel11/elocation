import { IsNotEmpty, IsString, IsDateString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID de l\'annonce' })
  @IsNotEmpty()
  @IsString()
  adId: string;

  @ApiProperty({ description: 'Date de début de la réservation', example: '2024-01-15' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Date de fin de la réservation', example: '2024-01-20' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Message pour le propriétaire', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'Montant du dépôt de garantie', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deposit?: number;
}