import { User } from '../../users/entities/user.entity';
import { Request } from './request.entity';
export declare class RequestComment {
    id: string;
    content: string;
    user: User;
    request: Request;
    createdAt: Date;
}
