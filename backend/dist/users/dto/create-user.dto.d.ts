import { UserRole } from '../../common/enums/user-role.enum';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
    role?: UserRole;
    profilePicture?: string;
    birthDate?: string;
}
