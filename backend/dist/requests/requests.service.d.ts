import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { RequestComment } from './entities/request-comment.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
export declare class RequestsService {
    private requestRepository;
    private requestCommentRepository;
    private userRepository;
    private categoryRepository;
    constructor(requestRepository: Repository<Request>, requestCommentRepository: Repository<RequestComment>, userRepository: Repository<User>, categoryRepository: Repository<Category>);
    create(createRequestDto: CreateRequestDto, userId: string): Promise<Request>;
    findAll(page?: number, limit?: number): Promise<{
        requests: Request[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<Request>;
    addComment(requestId: string, createCommentDto: CreateRequestCommentDto, userId: string): Promise<RequestComment>;
    updateStatus(id: string, status: string): Promise<Request>;
}
