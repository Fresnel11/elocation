import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
export declare class PermissionsService {
    private permissionRepository;
    private userRepository;
    private roleRepository;
    constructor(permissionRepository: Repository<Permission>, userRepository: Repository<User>, roleRepository: Repository<Role>);
    hasPermission(userId: string, permissionName: string): Promise<boolean>;
    grantPermissionToRole(roleId: string, permissionName: string): Promise<void>;
    revokePermissionFromRole(roleId: string, permissionName: string): Promise<void>;
    getRolePermissions(roleId: string): Promise<Permission[]>;
    getAllRoles(): Promise<Role[]>;
}
