import { PaymentProvider } from '../../common/enums/payment-provider.enum';
export declare class CreatePaymentDto {
    amount: number;
    provider: PaymentProvider;
    phoneNumber: string;
    description?: string;
}
