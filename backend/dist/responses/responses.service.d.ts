import { Repository } from 'typeorm';
import { Response } from './entities/response.entity';
import { CreateResponseDto } from './dto/create-response.dto';
export declare class ResponsesService {
    private responseRepository;
    constructor(responseRepository: Repository<Response>);
    create(requestId: string, createResponseDto: CreateResponseDto, userId: string): Promise<Response>;
    findByRequest(requestId: string): Promise<Response[]>;
}
