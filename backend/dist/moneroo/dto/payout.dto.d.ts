export declare class PayoutDto {
    amount: number;
    recipient: {
        phone?: string;
        email?: string;
        name?: string;
        bank_account?: string;
    };
}
