import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto, req: any): Promise<import("./entities/request.entity").Request>;
    findAll(): Promise<import("./entities/request.entity").Request[]>;
}
