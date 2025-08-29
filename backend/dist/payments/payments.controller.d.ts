import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initiatePayment(createPaymentDto: CreatePaymentDto, req: any): Promise<import("./entities/payment.entity").Payment>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto, req: any): Promise<import("./entities/payment.entity").Payment>;
    findMyPayments(req: any, paginationDto: PaginationDto): Promise<{
        payments: import("./entities/payment.entity").Payment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findAllPayments(paginationDto: PaginationDto): Promise<{
        payments: import("./entities/payment.entity").Payment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    checkRealEstateAccess(userId: string): Promise<boolean>;
    findOne(id: string): Promise<import("./entities/payment.entity").Payment>;
}
