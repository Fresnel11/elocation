import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/services/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        phone: string | null;
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
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import("../roles/entities/role.entity").Role;
        };
    }>;
    validateGoogleUser(googleUser: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import("../roles/entities/role.entity").Role;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        email: string;
        user: {
            id: string;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
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
}
