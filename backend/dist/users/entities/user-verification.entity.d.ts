import { User } from './user.entity';
export declare enum VerificationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum DocumentType {
    CNI = "cni",
    CIP = "cip",
    PASSPORT = "passport"
}
export declare class UserVerification {
    id: string;
    user: User;
    userId: string;
    selfiePhoto: string;
    documentType: DocumentType;
    documentFrontPhoto: string;
    documentBackPhoto: string;
    status: VerificationStatus;
    rejectionReason: string;
    reviewedBy: string;
    reviewedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
