import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';
export declare class Role {
    id: string;
    name: UserRole;
    description: string;
    users: User[];
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
}
