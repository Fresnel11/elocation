import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class MonerooService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    private readonly apiKey;
    constructor(httpService: HttpService, configService: ConfigService);
    initializePayment(amount: number, currency: string, metadata: any): Promise<any>;
    initializePayout(amount: number, recipient: any): Promise<any>;
}
