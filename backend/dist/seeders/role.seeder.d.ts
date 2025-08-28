import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
export declare class RoleSeeder {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    seed(): Promise<void>;
}
