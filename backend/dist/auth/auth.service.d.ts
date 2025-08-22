import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        phone: string;
        otpPreview: string;
        expiresAt: Date;
    }>;
    requestOtp(phone: string): Promise<{
        message: string;
        phone: string;
        otpPreview: string;
        expiresAt: Date;
    }>;
    verifyOtp(phone: string, code: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string;
            role: import("../common/enums/user-role.enum").UserRole;
        };
    }>;
}
