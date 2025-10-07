import { VerificationStatus } from '../entities/user-profile.entity';
export declare class UpdateProfileDto {
    bio?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    identityDocument?: string;
    verificationStatus?: VerificationStatus;
}
