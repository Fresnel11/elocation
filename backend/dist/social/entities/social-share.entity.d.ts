import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare enum SharePlatform {
    FACEBOOK = "facebook",
    TWITTER = "twitter",
    WHATSAPP = "whatsapp",
    TELEGRAM = "telegram",
    LINK = "link"
}
export declare class SocialShare {
    id: string;
    userId: string;
    user: User;
    adId: string;
    ad: Ad;
    platform: SharePlatform;
    createdAt: Date;
}
