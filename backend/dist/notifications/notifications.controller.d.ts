import { NotificationsService } from './notifications.service';
import { PushNotificationService } from './services/push-notification.service';
import { CreateSearchAlertDto } from './dto/create-search-alert.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly pushNotificationService;
    constructor(notificationsService: NotificationsService, pushNotificationService: PushNotificationService);
    getNotifications(req: any, page?: number, limit?: number): Promise<{
        data: import("./entities/notification.entity").Notification[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(id: string, req: any): Promise<{
        success: boolean;
    }>;
    deleteNotification(id: string, req: any): Promise<{
        success: boolean;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
    createSearchAlert(req: any, createSearchAlertDto: CreateSearchAlertDto): Promise<import("./entities/search-alert.entity").SearchAlert>;
    getUserSearchAlerts(req: any): Promise<import("./entities/search-alert.entity").SearchAlert[]>;
    updateSearchAlert(req: any, id: string, updateData: any): Promise<import("./entities/search-alert.entity").SearchAlert>;
    deleteSearchAlert(req: any, id: string): Promise<void>;
    getNotificationPreferences(req: any): Promise<import("./entities/notification-preference.entity").NotificationPreference[]>;
    updateNotificationPreference(req: any, updateDto: UpdateNotificationPreferenceDto): Promise<import("./entities/notification-preference.entity").NotificationPreference>;
    subscribeToPush(req: any, subscriptionData: {
        endpoint: string;
        keys: any;
    }): Promise<{
        success: boolean;
    }>;
    unsubscribeFromPush(req: any): Promise<{
        success: boolean;
    }>;
}
