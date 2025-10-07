import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    NEW_AD_MATCH = "new_ad_match",
    BOOKING_REMINDER = "booking_reminder",
    BOOKING_STATUS_CHANGE = "booking_status_change",
    PRICE_CHANGE = "price_change",
    MESSAGE_RECEIVED = "message_received",
    REVIEW_RECEIVED = "review_received"
}
export declare class NotificationPreference {
    id: string;
    userId: string;
    user: User;
    type: NotificationType;
    emailEnabled: boolean;
    pushEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
