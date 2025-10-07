import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare class PriceAlert {
    id: string;
    user: User;
    ad: Ad;
    previousPrice: number;
    newPrice: number;
    isRead: boolean;
    createdAt: Date;
}
