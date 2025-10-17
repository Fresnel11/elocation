import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/services/email.service';
import { ReferralsService } from '../referrals/referrals.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private referralsService;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, referralsService: ReferralsService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        phone: string;
        expiresAt: Date;
    }>;
    requestOtp(email: string): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
    }>;
    verifyOtp(email: string, code: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: import("../roles/entities/role.entity").Role;
            profilePicture: string;
        };
    }>;
    validateGoogleUser(googleUser: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: import("../roles/entities/role.entity").Role;
            profilePicture: string;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        email: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: import("../roles/entities/role.entity").Role;
        };
    }>;
    sendPasswordResetCode(email: string): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
    }>;
    resetPassword(email: string, code: string, newPassword: string): Promise<{
        message: string;
    }>;
    getUserWithProfile(userId: string): Promise<import("../users/entities/user.entity").User>;
}
