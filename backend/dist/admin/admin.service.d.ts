import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
import { Payment } from '../payments/entities/payment.entity';
import { StatsDto } from './dto/stats.dto';
export declare class AdminService {
    private readonly userRepository;
    private readonly adRepository;
    private readonly paymentRepository;
    constructor(userRepository: Repository<User>, adRepository: Repository<Ad>, paymentRepository: Repository<Payment>);
    getDashboardStats(): Promise<StatsDto>;
    moderateAd(adId: string, action: 'approve' | 'reject'): Promise<Ad>;
    getPendingAds(): Promise<Ad[]>;
    getRecentUsers(limit?: number): Promise<User[]>;
    getRecentPayments(limit?: number): Promise<Payment[]>;
}
