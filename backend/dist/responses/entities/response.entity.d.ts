import { User } from '../../users/entities/user.entity';
import { Request } from '../../requests/entities/request.entity';
export declare class Response {
    id: string;
    message: string;
    proposedPrice: number;
    contactPhone: string;
    contactEmail: string;
    availableFrom: Date;
    images: string[];
    user: User;
    userId: string;
    request: Request;
    requestId: string;
    createdAt: Date;
    updatedAt: Date;
}
