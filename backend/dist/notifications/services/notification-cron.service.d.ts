import { Repository } from 'typeorm';
import { SearchAlert } from '../entities/search-alert.entity';
import { Ad } from '../../ads/entities/ad.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { NotificationsService } from '../notifications.service';
import { EmailService } from './email.service';
export declare class NotificationCronService {
    private searchAlertRepository;
    private adRepository;
    private bookingRepository;
    private notificationsService;
    private emailService;
    constructor(searchAlertRepository: Repository<SearchAlert>, adRepository: Repository<Ad>, bookingRepository: Repository<Booking>, notificationsService: NotificationsService, emailService: EmailService);
    checkNewAdMatches(): Promise<void>;
    sendBookingReminders(): Promise<void>;
    cleanupOldNotifications(): Promise<void>;
}
