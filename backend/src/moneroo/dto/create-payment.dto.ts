import { IsNumber, IsString, IsObject, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}