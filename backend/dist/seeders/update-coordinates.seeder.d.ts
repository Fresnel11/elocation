import { Repository } from 'typeorm';
import { Ad } from '../ads/entities/ad.entity';
export declare class UpdateCoordinatesSeeder {
    private readonly adRepository;
    constructor(adRepository: Repository<Ad>);
    private readonly cityCoordinates;
    updateCoordinates(): Promise<void>;
}
