import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
export declare class RolePermissionSeeder {
    private roleRepository;
    private permissionRepository;
    constructor(roleRepository: Repository<Role>, permissionRepository: Repository<Permission>);
    seed(): Promise<void>;
}
