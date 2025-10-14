import { User } from '../../users/entities/user.entity';
export declare class UserPreference {
    id: string;
    userId: string;
    user: User;
    type: string;
    data: {
        categoryId?: string;
        location?: string;
        priceRange?: [number, number];
        bedrooms?: number;
        bathrooms?: number;
        amenities?: string[];
        adId?: string;
    };
    weight: number;
    createdAt: Date;
}
