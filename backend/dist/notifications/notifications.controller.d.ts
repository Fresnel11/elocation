import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(req: any): Promise<import("./entities/notification.entity").Notification[]>;
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
    }>;
    markAsRead(req: any, id: string): Promise<{
        success: boolean;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
}
