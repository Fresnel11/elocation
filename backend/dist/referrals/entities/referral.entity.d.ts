import { User } from '../../users/entities/user.entity';
export declare enum ReferralStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    REWARDED = "rewarded"
}
export declare class Referral {
    id: string;
    referrerId: string;
    referrer: User;
    referredId: string;
    referred: User;
    referralCode: string;
    status: ReferralStatus;
    rewardAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
