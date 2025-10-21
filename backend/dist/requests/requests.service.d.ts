import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class RequestsService {
    private requestRepository;
    constructor(requestRepository: Repository<Request>);
    create(createRequestDto: CreateRequestDto, userId: string): Promise<Request>;
    findAll(): Promise<Request[]>;
    findOne(id: string): Promise<Request>;
    update(id: string, updateRequestDto: CreateRequestDto, userId: string): Promise<Request>;
    remove(id: string, userId: string): Promise<void>;
}
