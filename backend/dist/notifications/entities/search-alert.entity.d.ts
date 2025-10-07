import { User } from '../../users/entities/user.entity';
export declare class SearchAlert {
    id: string;
    userId: string;
    user: User;
    name: string;
    location: string;
    categoryId: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    isActive: boolean;
    lastNotifiedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
