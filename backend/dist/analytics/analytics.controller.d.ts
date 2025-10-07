import { AnalyticsService } from './services/analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(req: any): Promise<{
        totalAds: number;
        activeAds: number;
        totalViews: number;
        totalBookings: number;
        totalRevenue: number;
        occupancyRate: number;
        monthlyStats: any[];
        topPerformingAds: import("../ads/entities/ad.entity").Ad[];
    }>;
}
