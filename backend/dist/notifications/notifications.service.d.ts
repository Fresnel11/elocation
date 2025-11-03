import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { SearchAlert } from './entities/search-alert.entity';
import { EmailService } from './services/email.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateSearchAlertDto } from './dto/create-search-alert.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
export declare class NotificationsService {
    private notificationRepository;
    private preferenceRepository;
    private searchAlertRepository;
    private emailService;
    constructor(notificationRepository: Repository<Notification>, preferenceRepository: Repository<NotificationPreference>, searchAlertRepository: Repository<SearchAlert>, emailService: EmailService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
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
    createSearchAlert(userId: string, createSearchAlertDto: CreateSearchAlertDto): Promise<SearchAlert>;
    getUserSearchAlerts(userId: string): Promise<SearchAlert[]>;
    updateSearchAlert(id: string, userId: string, updateData: any): Promise<SearchAlert>;
    deleteSearchAlert(id: string, userId: string): Promise<void>;
    getNotificationPreferences(userId: string): Promise<NotificationPreference[]>;
    updateNotificationPreference(userId: string, updateDto: UpdateNotificationPreferenceDto): Promise<NotificationPreference>;
    updateNotificationPreferenceLegacy(userId: string, type: string, emailEnabled: boolean, pushEnabled: boolean): Promise<NotificationPreference>;
    private sendWebSocketNotification;
}
