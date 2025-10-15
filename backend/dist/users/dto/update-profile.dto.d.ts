import { VerificationStatus } from '../entities/user-profile.entity';
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    whatsappNumber?: string;
    bio?: string;
    address?: string;
    avatar?: string;
    identityDocument?: string;
    verificationStatus?: VerificationStatus;
}
