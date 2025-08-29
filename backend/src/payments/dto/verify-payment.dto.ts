import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'ID du paiement à vérifier',
    example: 'uuid-payment-id'
  })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({
    description: 'Code de transaction Mobile Money',
    example: 'TX123456789'
  })
  @IsString()
  @IsNotEmpty()
  transactionCode: string;
}