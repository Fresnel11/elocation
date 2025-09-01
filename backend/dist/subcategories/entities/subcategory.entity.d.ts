import { Category } from '../../categories/entities/category.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare class SubCategory {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    category: Category;
    categoryId: string;
    ads: Ad[];
    createdAt: Date;
    updatedAt: Date;
}
