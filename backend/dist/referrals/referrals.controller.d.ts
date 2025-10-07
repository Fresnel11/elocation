import { ReferralsService } from './referrals.service';
export declare class ReferralsController {
    private readonly referralsService;
    constructor(referralsService: ReferralsService);
    getMyReferralCode(req: any): Promise<{
        referralCode: string;
    }>;
    useReferralCode(req: any, code: string): Promise<{
        success: boolean;
        referral: import("./entities/referral.entity").Referral;
    }>;
    getMyReferrals(req: any): Promise<import("./entities/referral.entity").Referral[]>;
    getReferralStats(req: any): Promise<{
        totalReferrals: number;
        completedReferrals: number;
        totalRewards: number;
    }>;
    getLoyaltyPoints(req: any): Promise<{
        total: number;
        history: import("./entities/loyalty-points.entity").LoyaltyPoints[];
    }>;
}
