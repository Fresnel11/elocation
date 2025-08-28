import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../../users/entities/user.entity';
export declare class Role {
    id: string;
    name: UserRole;
    description: string;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
