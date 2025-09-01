import { Repository } from 'typeorm';
import { Ad } from '../ads/entities/ad.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
export declare class AdSeeder {
    private adRepository;
    private userRepository;
    private categoryRepository;
    constructor(adRepository: Repository<Ad>, userRepository: Repository<User>, categoryRepository: Repository<Category>);
    seed(): Promise<void>;
}
