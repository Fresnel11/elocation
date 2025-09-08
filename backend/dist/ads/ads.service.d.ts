import { Repository } from 'typeorm';
import { Ad } from './entities/ad.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { SearchAdsDto } from './dto/search-ads.dto';
import { User } from '../users/entities/user.entity';
import { GeocodingService } from '../common/services/geocoding.service';
export declare class AdsService {
    private readonly adRepository;
    private readonly geocodingService;
    constructor(adRepository: Repository<Ad>, geocodingService: GeocodingService);
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
}
