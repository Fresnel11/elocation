import { Repository } from 'typeorm';
import { PriceAlert } from './entities/price-alert.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PriceAlertsService {
    private priceAlertRepository;
    private favoriteRepository;
    private notificationsService;
    constructor(priceAlertRepository: Repository<PriceAlert>, favoriteRepository: Repository<Favorite>, notificationsService: NotificationsService);
    checkPriceChanges(adId: string, newPrice: number, previousPrice: number): Promise<void>;
    private createPriceAlert;
    getUserPriceAlerts(userId: string): Promise<PriceAlert[]>;
    markAsRead(alertId: string): Promise<void>;
}
