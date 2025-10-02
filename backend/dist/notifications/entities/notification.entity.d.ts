import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    NEW_MESSAGE = "new_message",
    NEW_RESPONSE = "new_response",
    AD_APPROVED = "ad_approved",
    AD_REJECTED = "ad_rejected"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    relatedId: string;
    user: User;
    userId: string;
    createdAt: Date;
}
