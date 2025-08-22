import { UserRole } from '../../common/enums/user-role.enum';
import { Ad } from '../../ads/entities/ad.entity';
import { Payment } from '../../payments/entities/payment.entity';
export declare class User {
    id: string;
    email: string | null;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    profilePicture: string | null;
    birthDate: Date | null;
    lastLogin: Date | null;
    otpCode: string | null;
    otpExpiresAt: Date | null;
    role: UserRole;
    isActive: boolean;
    ads: Ad[];
    payments: Payment[];
    createdAt: Date;
    updatedAt: Date;
}
