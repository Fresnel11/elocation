import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class SearchAdsDto extends PaginationDto {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'price' | 'title' | 'location';
    sortOrder?: 'ASC' | 'DESC';
}
