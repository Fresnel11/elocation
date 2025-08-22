import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { PaymentProvider } from '../../common/enums/payment-provider.enum';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  amount: number;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  description?: string;
}