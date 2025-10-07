import { NotificationType } from '../entities/notification-preference.entity';
export declare class UpdateNotificationPreferenceDto {
    type: NotificationType;
    emailEnabled: boolean;
    pushEnabled: boolean;
}
