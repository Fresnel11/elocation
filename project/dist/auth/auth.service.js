"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        if (!registerDto.email && !registerDto.phone) {
            throw new common_1.BadRequestException('Email or phone is required');
        }
        if (registerDto.email) {
            const existingUser = await this.usersService.findByEmail(registerDto.email);
            if (existingUser) {
                throw new common_1.ConflictException('User already exists');
            }
        }
        const user = await this.usersService.create(registerDto);
        const code = (Math.floor(100000 + Math.random() * 900000)).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.usersService.setOtpForPhone(user.phone, code, expiresAt);
        return {
            message: 'Registration successful. Verify your phone with the OTP code.',
            phone: user.phone,
            otpPreview: code,
            expiresAt,
        };
    }
    async requestOtp(phone) {
        const user = await this.usersService.findByPhone(phone);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const code = (Math.floor(100000 + Math.random() * 900000)).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.usersService.setOtpForPhone(phone, code, expiresAt);
        return { message: 'OTP sent', phone, otpPreview: code, expiresAt };
    }
    async verifyOtp(phone, code) {
        const ok = await this.usersService.verifyOtpForPhone(phone, code);
        if (!ok) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        return { message: 'Phone verified. You can now log in.' };
    }
    async login(loginDto) {
        var _a;
        if (!loginDto.email && !loginDto.phone) {
            throw new common_1.BadRequestException('Email or phone is required');
        }
        const user = loginDto.email
            ? await this.usersService.findByEmail(loginDto.email)
            : await this.usersService.findByPhone(loginDto.phone);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.usersService.setLastLogin(user.id);
        const payload = { sub: user.id, role: user.role, email: (_a = user.email) !== null && _a !== void 0 ? _a : undefined };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map