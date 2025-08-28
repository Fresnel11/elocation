import { UserRole } from '../../common/enums/user-role.enum';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
    role: UserRole;
}
