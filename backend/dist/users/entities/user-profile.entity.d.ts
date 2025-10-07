import { User } from './user.entity';
export declare enum VerificationStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected"
}
export declare class UserProfile {
    id: string;
    userId: string;
    user: User;
    avatar: string;
    bio: string;
    phone: string;
    address: string;
    identityDocument: string;
    verificationStatus: VerificationStatus;
    badges: string[];
    totalBookings: number;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
}
