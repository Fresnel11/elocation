import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare class Message {
    id: string;
    content: string;
    isEncrypted: boolean;
    imageUrl: string | null;
    messageType: 'text' | 'image';
    isRead: boolean;
    sender: User;
    senderId: string;
    receiver: User;
    receiverId: string;
    ad: Ad | null;
    adId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
