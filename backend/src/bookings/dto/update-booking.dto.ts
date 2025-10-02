import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class UpdateBookingDto {
  @ApiProperty({ description: 'Nouveau statut de la réservation', enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ description: 'Raison d\'annulation', required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}