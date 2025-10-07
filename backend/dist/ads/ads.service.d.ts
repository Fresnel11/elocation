import { PriceAlertsService } from '../price-alerts/price-alerts.service';
import { Repository } from 'typeorm';
import { Ad } from './entities/ad.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { SearchAdsDto } from './dto/search-ads.dto';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AdsService {
    private readonly adRepository;
    private readonly priceAlertsService;
    private readonly notificationsService;
    constructor(adRepository: Repository<Ad>, priceAlertsService: PriceAlertsService, notificationsService: NotificationsService);
    create(createAdDto: CreateAdDto, user: User): Promise<Ad>;
    findAll(searchAdsDto: SearchAdsDto): Promise<{
        ads: Ad[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<Ad>;
    findUserAds(userId: string, searchAdsDto: SearchAdsDto): Promise<{
        ads: Ad[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    update(id: string, updateAdDto: UpdateAdDto, user: User): Promise<Ad>;
    remove(id: string, user: User): Promise<void>;
    toggleAdStatus(id: string, user: User): Promise<Ad>;
    redirectToWhatsapp(id: string): Promise<{
        whatsappLink: string;
    }>;
    uploadPhotos(id: string, photos: string[], user: User): Promise<Ad>;
    private checkSearchAlerts;
}
