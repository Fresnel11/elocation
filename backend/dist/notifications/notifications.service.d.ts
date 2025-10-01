import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    createNotification(userId: string, type: NotificationType, title: string, message: string, relatedId?: string): Promise<Notification>;
    getUserNotifications(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAllAsRead(userId: string): Promise<void>;
}
