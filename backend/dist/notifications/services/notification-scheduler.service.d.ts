import { Repository } from 'typeorm';
import { SearchAlert } from '../entities/search-alert.entity';
import { Ad } from '../../ads/entities/ad.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { EmailService } from './email.service';
import { NotificationsService } from '../notifications.service';
export declare class NotificationSchedulerService {
    private searchAlertRepository;
    private adRepository;
    private bookingRepository;
    private emailService;
    private notificationsService;
    constructor(searchAlertRepository: Repository<SearchAlert>, adRepository: Repository<Ad>, bookingRepository: Repository<Booking>, emailService: EmailService, notificationsService: NotificationsService);
    checkNewAdMatches(): Promise<void>;
    sendBookingReminders(): Promise<void>;
}
