import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class MonerooService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    private readonly apiKey;
    constructor(httpService: HttpService, configService: ConfigService);
    initializePayment(paymentData: {
        amount: number;
        currency: string;
        description: string;
        customer: {
            email: string;
            firstName: string;
            lastName: string;
            phone?: string;
        };
        returnUrl: string;
        metadata: any;
    }): Promise<any>;
    verifyPayment(paymentId: string): Promise<any>;
    initializePayout(amount: number, recipient: any): Promise<any>;
}
