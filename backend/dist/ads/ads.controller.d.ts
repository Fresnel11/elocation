import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { SearchAdsDto } from './dto/search-ads.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class AdsController {
    private readonly adsService;
    constructor(adsService: AdsService);
    create(createAdDto: CreateAdDto, req: any): Promise<import("./entities/ad.entity").Ad>;
    findAll(searchAdsDto: SearchAdsDto): Promise<{
        ads: import("./entities/ad.entity").Ad[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findUserAds(userId: string, paginationDto: PaginationDto): Promise<{
        ads: import("./entities/ad.entity").Ad[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findMyAds(req: any, paginationDto: PaginationDto): Promise<{
        ads: import("./entities/ad.entity").Ad[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/ad.entity").Ad>;
    redirectToWhatsapp(id: string): Promise<{
        whatsappLink: string;
    }>;
    update(id: string, updateAdDto: UpdateAdDto, req: any): Promise<import("./entities/ad.entity").Ad>;
    remove(id: string, req: any): Promise<void>;
    toggleStatus(id: string, req: any): Promise<import("./entities/ad.entity").Ad>;
    uploadPhotos(id: string, files: Express.Multer.File[], req: any): Promise<import("./entities/ad.entity").Ad>;
}
