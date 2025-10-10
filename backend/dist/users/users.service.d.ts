import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../roles/entities/role.entity';
import { UserVerification } from './entities/user-verification.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class UsersService {
    private readonly userRepository;
    private readonly profileRepository;
    private readonly roleRepository;
    private readonly verificationRepository;
    private readonly notificationsGateway;
    private readonly notificationsService;
    constructor(userRepository: Repository<User>, profileRepository: Repository<UserProfile>, roleRepository: Repository<Role>, verificationRepository: Repository<UserVerification>, notificationsGateway: NotificationsGateway, notificationsService: NotificationsService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(paginationDto: PaginationDto): Promise<{
        users: User[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    toggleUserStatus(id: string): Promise<User>;
    setLastLogin(id: string): Promise<void>;
    setOtpForPhone(phone: string, code: string, expiresAt: Date): Promise<void>;
    verifyOtpForPhone(phone: string, code: string): Promise<boolean>;
    setOtpForEmail(email: string, code: string, expiresAt: Date): Promise<void>;
    setOtpForPasswordReset(email: string, code: string, expiresAt: Date): Promise<void>;
    verifyOtpForEmail(email: string, code: string): Promise<boolean>;
    createGoogleUser(googleData: any): Promise<User>;
    verifyOtpForPasswordReset(email: string, code: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string): Promise<void>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserProfile>;
    uploadAvatar(userId: string, avatarUrl: string): Promise<UserProfile>;
    getProfile(userId: string): Promise<UserProfile>;
    addBadge(userId: string, badge: string): Promise<UserProfile>;
    getPublicProfile(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        createdAt: Date;
        profile: UserProfile;
        _count: {
            ads: number;
        };
    }>;
    submitVerification(userId: string, submitVerificationDto: SubmitVerificationDto): Promise<UserVerification>;
    reviewVerification(verificationId: string, reviewDto: ReviewVerificationDto, adminId: string): Promise<UserVerification>;
    getPendingVerifications(): Promise<UserVerification[]>;
    getUserVerification(userId: string): Promise<UserVerification | null>;
}
