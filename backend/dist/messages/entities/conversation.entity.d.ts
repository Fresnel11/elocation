import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare class Conversation {
    id: string;
    user1: User;
    user1Id: string;
    user2: User;
    user2Id: string;
    ad: Ad | null;
    adId: string | null;
    lastMessageContent: string;
    lastMessageAt: Date;
    unreadCountUser1: number;
    unreadCountUser2: number;
    createdAt: Date;
    updatedAt: Date;
}
