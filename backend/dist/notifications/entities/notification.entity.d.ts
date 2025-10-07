import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    BOOKING_REQUEST = "booking_request",
    BOOKING_CONFIRMED = "booking_confirmed",
    BOOKING_CANCELLED = "booking_cancelled",
    BOOKING_EXPIRED = "booking_expired",
    BOOKING_REMINDER = "booking_reminder",
    NEW_MESSAGE = "new_message",
    NEW_AD_MATCH = "new_ad_match",
    AD_APPROVED = "ad_approved",
    AD_REJECTED = "ad_rejected",
    PRICE_CHANGE = "price_change"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data: any;
    read: boolean;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
