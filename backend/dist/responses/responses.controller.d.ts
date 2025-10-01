import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
export declare class ResponsesController {
    private readonly responsesService;
    constructor(responsesService: ResponsesService);
    create(requestId: string, createResponseDto: CreateResponseDto, req: any): Promise<import("./entities/response.entity").Response>;
    findByRequest(requestId: string): Promise<import("./entities/response.entity").Response[]>;
}
