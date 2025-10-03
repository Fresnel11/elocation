import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
export declare class PermissionSeeder {
    private permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
    seed(): Promise<void>;
}
