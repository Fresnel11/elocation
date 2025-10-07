import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare enum InteractionType {
    VIEW = "view",
    FAVORITE = "favorite",
    SHARE = "share",
    CONTACT = "contact",
    BOOKING = "booking"
}
export declare class UserInteraction {
    id: string;
    userId: string;
    user: User;
    adId: string;
    ad: Ad;
    type: InteractionType;
    metadata: any;
    createdAt: Date;
}
