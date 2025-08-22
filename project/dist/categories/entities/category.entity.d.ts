import { Ad } from '../../ads/entities/ad.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    ads: Ad[];
    createdAt: Date;
    updatedAt: Date;
}
