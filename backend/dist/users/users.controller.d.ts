import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ReviewsService } from '../reviews/reviews.service';
export declare class UsersController {
    private readonly usersService;
    private readonly reviewsService;
    constructor(usersService: UsersService, reviewsService: ReviewsService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(paginationDto: PaginationDto): Promise<{
        users: import("./entities/user.entity").User[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("./entities/user-profile.entity").UserProfile>;
    getProfile(req: any): Promise<{
        phone: string;
        id: string;
        userId: string;
        user: import("./entities/user.entity").User;
        avatar: string;
        bio: string;
        address: string;
        identityDocument: string;
        verificationStatus: import("./entities/user-profile.entity").VerificationStatus;
        badges: string[];
        totalBookings: number;
        averageRating: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPublicProfile(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        createdAt: Date;
        profile: import("./entities/user-profile.entity").UserProfile;
        _count: {
            ads: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
    toggleStatus(id: string): Promise<import("./entities/user.entity").User>;
    uploadAvatar(req: any, avatarUrl: string): Promise<import("./entities/user-profile.entity").UserProfile>;
    getUserReputation(id: string): Promise<{
        averageRating: number;
        totalReviews: number;
        reputationLevel: string;
        reputationScore: number;
    }>;
    submitVerification(req: any, submitVerificationDto: SubmitVerificationDto): Promise<import("./entities/user-verification.entity").UserVerification>;
    getPendingVerifications(): Promise<import("./entities/user-verification.entity").UserVerification[]>;
    reviewVerification(id: string, reviewDto: ReviewVerificationDto, req: any): Promise<import("./entities/user-verification.entity").UserVerification>;
    getVerificationStatus(req: any): Promise<{
        isVerified: boolean;
        verification: import("./entities/user-verification.entity").UserVerification;
    }>;
}
