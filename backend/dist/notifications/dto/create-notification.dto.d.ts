import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
}
