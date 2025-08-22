import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PaymentsService {
    private readonly paymentRepository;
    private readonly configService;
    constructor(paymentRepository: Repository<Payment>, configService: ConfigService);
    initiatePayment(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto, user: User): Promise<Payment>;
    findUserPayments(userId: string, paginationDto: PaginationDto): Promise<{
        payments: Payment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findAllPayments(paginationDto: PaginationDto): Promise<{
        payments: Payment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<Payment>;
    hasValidPaymentForRealEstate(userId: string): Promise<boolean>;
    private simulateMobileMoneyRequest;
    private simulatePaymentVerification;
}
