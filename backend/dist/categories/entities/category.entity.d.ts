import { Ad } from '../../ads/entities/ad.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';
import { Request } from '../../requests/entities/request.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    ads: Ad[];
    subCategories: SubCategory[];
    requests: Request[];
    createdAt: Date;
    updatedAt: Date;
}
