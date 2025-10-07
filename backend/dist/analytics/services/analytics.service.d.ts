import { Repository } from 'typeorm';
import { UserAnalytics } from '../entities/user-analytics.entity';
import { Ad } from '../../ads/entities/ad.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class AnalyticsService {
    private analyticsRepository;
    private adRepository;
    private bookingRepository;
    constructor(analyticsRepository: Repository<UserAnalytics>, adRepository: Repository<Ad>, bookingRepository: Repository<Booking>);
    getUserStats(userId: string): Promise<{
        totalAds: number;
        activeAds: number;
        totalViews: number;
        totalBookings: number;
        totalRevenue: number;
        occupancyRate: number;
        monthlyStats: any[];
        topPerformingAds: Ad[];
    }>;
    private getOrCreateAnalytics;
    private calculateOccupancyRate;
    private getMonthlyStats;
    private getTopPerformingAds;
}
