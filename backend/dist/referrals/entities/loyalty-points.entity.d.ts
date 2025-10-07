import { User } from '../../users/entities/user.entity';
export declare enum PointType {
    REFERRAL = "referral",
    BOOKING = "booking",
    REVIEW = "review",
    BONUS = "bonus"
}
export declare class LoyaltyPoints {
    id: string;
    userId: string;
    user: User;
    type: PointType;
    points: number;
    description: string;
    referenceId: string;
    createdAt: Date;
}
