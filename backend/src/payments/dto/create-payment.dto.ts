import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min, IsOptional } from 'class-validator';
import { PaymentProvider } from '../../common/enums/payment-provider.enum';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Montant du paiement en FCFA',
    example: 5000,
    minimum: 100
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({
    description: 'Fournisseur de paiement',
    example: 'MTN',
    enum: PaymentProvider
  })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({
    description: 'Numéro de téléphone pour le paiement Mobile Money',
    example: '+22999154678',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Description du paiement',
    example: 'Accès aux contacts immobiliers',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type de service payé',
    example: 'real-estate-access',
    required: false
  })
  @IsOptional()
  @IsString()
  serviceType?: string;
}