import { UserRole } from '../../common/enums/user-role.enum';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
    profilePicture?: string;
    birthDate?: string;
}
