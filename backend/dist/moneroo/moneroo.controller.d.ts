import { MonerooService } from './moneroo.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PayoutDto } from './dto/payout.dto';
import { BookingsService } from '../bookings/bookings.service';
export declare class MonerooController {
    private readonly monerooService;
    private readonly bookingsService;
    constructor(monerooService: MonerooService, bookingsService: BookingsService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<any>;
    webhook(req: any, res: any): Promise<any>;
    releaseFunds(payoutDto: PayoutDto): Promise<any>;
    verifyPayment(paymentId: string): Promise<any>;
    paymentReturn(query: any, res: any): Promise<any>;
}
