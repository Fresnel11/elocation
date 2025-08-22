import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class SearchAdsDto extends PaginationDto {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    isAvailable?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
