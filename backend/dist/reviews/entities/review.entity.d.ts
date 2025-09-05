import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare class Review {
    id: string;
    rating: number;
    comment: string;
    user: User;
    ad: Ad;
    createdAt: Date;
    updatedAt: Date;
}
