import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';
export declare class Ad {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    isAvailable: boolean;
    isActive: boolean;
    photos: string[];
    video: string;
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
    subCategory: SubCategory;
    subCategoryId: string;
    createdAt: Date;
    updatedAt: Date;
}
