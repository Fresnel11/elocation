import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Ad {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    isAvailable: boolean;
    isActive: boolean;
    photos: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
    amenities: string[];
    whatsappLink: string;
    whatsappNumber: string;
    user: User;
    userId: string;
    category: Category;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}
