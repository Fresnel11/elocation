import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        phone: string;
        expiresAt: Date;
    }>;
    requestOtp(body: RequestOtpDto): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
    }>;
    verifyOtp(body: VerifyOtpDto): Promise<{
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
    getProfile(req: any): any;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import("../roles/entities/role.entity").Role;
        profilePicture: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    forgotPassword(body: ForgotPasswordDto): Promise<{
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
    sendPasswordResetCode(body: ForgotPasswordDto): Promise<{
        message: string;
        email: string;
        expiresAt: Date;
    }>;
    resetPassword(body: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
