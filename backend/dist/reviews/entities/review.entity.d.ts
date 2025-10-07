import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare enum ReviewStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Review {
    id: string;
    rating: number;
    comment: string;
    status: ReviewStatus;
    user: User;
    ad: Ad;
    createdAt: Date;
    updatedAt: Date;
}
