import { VerificationStatus } from '../entities/user-verification.entity';
export declare class ReviewVerificationDto {
    status: VerificationStatus;
    rejectionReason?: string;
}
