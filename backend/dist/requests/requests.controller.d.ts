import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto, req: any): Promise<import("./entities/request.entity").Request>;
    findAll(): Promise<import("./entities/request.entity").Request[]>;
    findOne(id: string): Promise<import("./entities/request.entity").Request>;
    update(id: string, updateRequestDto: CreateRequestDto, req: any): Promise<import("./entities/request.entity").Request>;
    remove(id: string, req: any): Promise<void>;
}
