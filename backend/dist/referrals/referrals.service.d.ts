import { Repository } from 'typeorm';
import { Referral } from './entities/referral.entity';
import { LoyaltyPoints, PointType } from './entities/loyalty-points.entity';
import { User } from '../users/entities/user.entity';
export declare class ReferralsService {
    private referralRepository;
    private loyaltyPointsRepository;
    private userRepository;
    constructor(referralRepository: Repository<Referral>, loyaltyPointsRepository: Repository<LoyaltyPoints>, userRepository: Repository<User>);
    generateReferralCode(userId: string): Promise<string>;
    useReferralCode(referralCode: string, newUserId: string): Promise<Referral>;
    completeReferral(referredUserId: string): Promise<void>;
    addLoyaltyPoints(userId: string, type: PointType, points: number, description?: string, referenceId?: string): Promise<void>;
    getUserLoyaltyPoints(userId: string): Promise<{
        total: number;
        history: LoyaltyPoints[];
    }>;
    getUserReferrals(userId: string): Promise<Referral[]>;
    getReferralStats(userId: string): Promise<{
        totalReferrals: number;
        completedReferrals: number;
        totalRewards: number;
    }>;
}
