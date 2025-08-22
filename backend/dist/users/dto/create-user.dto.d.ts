import { UserRole } from '../../common/enums/user-role.enum';
export declare class CreateUserDto {
    email?: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    role?: UserRole;
    profilePicture?: string;
    birthDate?: string;
}
