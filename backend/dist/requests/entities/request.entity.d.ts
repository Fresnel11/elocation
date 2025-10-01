import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Response } from '../../responses/entities/response.entity';
export declare class Request {
    id: string;
    title: string;
    description: string;
    location: string;
    maxBudget: number;
    bedrooms: number;
    bathrooms: number;
    minArea: number;
    desiredAmenities: string[];
    isActive: boolean;
    user: User;
    userId: string;
    category: Category;
    categoryId: string;
    createdAt: Date;
    responses: Response[];
    updatedAt: Date;
}
