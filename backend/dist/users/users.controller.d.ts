import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("./entities/user-profile.entity").UserProfile>;
    getProfile(req: any): Promise<import("./entities/user-profile.entity").UserProfile>;
    uploadAvatar(req: any, avatarUrl: string): Promise<import("./entities/user-profile.entity").UserProfile>;
    getUserReputation(id: string): Promise<{
        averageRating: number;
        totalReviews: number;
        reputationLevel: string;
        reputationScore: number;
    }>;
}
