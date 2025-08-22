import { User } from '../../users/entities/user.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { PaymentProvider } from '../../common/enums/payment-provider.enum';
export declare class Payment {
    id: string;
    amount: number;
    provider: PaymentProvider;
    status: PaymentStatus;
    phoneNumber: string;
    transactionId: string;
    externalTransactionId: string;
    description: string;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
