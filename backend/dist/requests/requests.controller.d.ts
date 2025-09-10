import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto, req: any): Promise<import("./entities/request.entity").Request>;
    findAll(page?: string, limit?: string): Promise<{
        requests: import("./entities/request.entity").Request[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/request.entity").Request>;
    addComment(id: string, createCommentDto: CreateRequestCommentDto, req: any): Promise<import("./entities/request-comment.entity").RequestComment>;
    updateStatus(id: string, status: string): Promise<import("./entities/request.entity").Request>;
}
