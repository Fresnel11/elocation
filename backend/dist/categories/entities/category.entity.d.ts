import { Ad } from '../../ads/entities/ad.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    ads: Ad[];
    subCategories: SubCategory[];
    createdAt: Date;
    updatedAt: Date;
}
