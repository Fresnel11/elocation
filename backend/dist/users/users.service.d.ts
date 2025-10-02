import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../roles/entities/role.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
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
    getPublicProfile(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        createdAt: Date;
        _count: {
            ads: number;
        };
    }>;
}
