import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<import("./dto/stats.dto").StatsDto>;
    getPendingAds(): Promise<import("../ads/entities/ad.entity").Ad[]>;
    moderateAd(id: string, action: 'approve' | 'reject'): Promise<import("../ads/entities/ad.entity").Ad>;
    getRecentUsers(limit?: string): Promise<import("../users/entities/user.entity").User[]>;
    getRecentPayments(limit?: string): Promise<import("../payments/entities/payment.entity").Payment[]>;
}
