import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        phone: string | null;
        otpPreview: string;
        expiresAt: Date;
    }>;
    requestOtp(body: RequestOtpDto): Promise<{
        message: string;
        email: string;
        otpPreview: string;
        expiresAt: Date;
    }>;
    verifyOtp(body: VerifyOtpDto): Promise<{
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
    getProfile(req: any): any;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
}
