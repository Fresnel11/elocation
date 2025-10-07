import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare class Favorite {
    id: string;
    user: User;
    ad: Ad;
    createdAt: Date;
}
