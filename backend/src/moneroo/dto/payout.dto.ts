import { IsNumber, IsString, IsObject } from 'class-validator';

export class PayoutDto {
  @IsNumber()
  amount: number;

  @IsObject()
  recipient: {
    phone?: string;
    email?: string;
    name?: string;
    bank_account?: string;
  };
}