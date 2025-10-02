import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private notificationRepository;
    private notificationsGateway;
    constructor(notificationRepository: Repository<Notification>, notificationsGateway: NotificationsGateway);
    createNotification(userId: string, type: NotificationType, title: string, message: string, data?: any): Promise<Notification>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        data: Notification[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    deleteNotification(notificationId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    notifyBookingRequest(ownerId: string, bookingData: any): Promise<Notification>;
    notifyBookingConfirmed(tenantId: string, bookingData: any): Promise<Notification>;
    notifyBookingCancelled(userId: string, bookingData: any, reason?: string): Promise<Notification>;
}
