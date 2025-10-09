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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
const user_profile_entity_1 = require("./entities/user-profile.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let UsersService = class UsersService {
    constructor(userRepository, profileRepository, roleRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.roleRepository = roleRepository;
    }
    async create(createUserDto) {
        var _a;
        if (createUserDto.email) {
            const existingByEmail = await this.userRepository.findOne({
                where: { email: createUserDto.email.toLowerCase() },
            });
            if (existingByEmail) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        const existingByPhone = await this.userRepository.findOne({
            where: { phone: createUserDto.phone },
        });
        if (existingByPhone) {
            throw new common_1.ConflictException('User with this phone already exists');
        }
        const role = await this.roleRepository.findOne({ where: { name: user_role_enum_1.UserRole.USER } });
        if (!role) {
            throw new common_1.NotFoundException('Default user role not found');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            email: createUserDto.email ? createUserDto.email.toLowerCase() : null,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            phone: createUserDto.phone,
            password: hashedPassword,
            profilePicture: (_a = createUserDto.profilePicture) !== null && _a !== void 0 ? _a : null,
            birthDate: createUserDto.birthDate ? new Date(createUserDto.birthDate) : null,
            role: role,
            isActive: false,
        });
        return this.userRepository.save(user);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['ads', 'payments', 'profile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        if (!email)
            return null;
        return this.userRepository.findOne({
            where: { email: email.toLowerCase() },
            relations: ['role'],
        });
    }
    async findByPhone(phone) {
        return this.userRepository.findOne({ where: { phone } });
    }
    async update(id, updateUserDto) {
        var _a, _b, _c, _d;
        const user = await this.findOne(id);
        if (updateUserDto.email && updateUserDto.email.toLowerCase() !== user.email) {
            const exists = await this.userRepository.findOne({ where: { email: updateUserDto.email.toLowerCase() } });
            if (exists) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
            const exists = await this.userRepository.findOne({ where: { phone: updateUserDto.phone } });
            if (exists) {
                throw new common_1.ConflictException('Phone already in use');
            }
        }
        let role = user.role;
        if (updateUserDto.role) {
            const foundRole = await this.roleRepository.findOne({ where: { name: updateUserDto.role } });
            if (!foundRole) {
                throw new common_1.NotFoundException(`Role ${updateUserDto.role} not found`);
            }
            role = foundRole;
        }
        Object.assign(user, {
            email: updateUserDto.email ? updateUserDto.email.toLowerCase() : user.email,
            firstName: (_a = updateUserDto.firstName) !== null && _a !== void 0 ? _a : user.firstName,
            lastName: (_b = updateUserDto.lastName) !== null && _b !== void 0 ? _b : user.lastName,
            phone: (_c = updateUserDto.phone) !== null && _c !== void 0 ? _c : user.phone,
            profilePicture: (_d = updateUserDto.profilePicture) !== null && _d !== void 0 ? _d : user.profilePicture,
            birthDate: updateUserDto.birthDate ? new Date(updateUserDto.birthDate) : user.birthDate,
            role: role,
        });
        return this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
    async toggleUserStatus(id) {
        const user = await this.findOne(id);
        user.isActive = !user.isActive;
        return this.userRepository.save(user);
    }
    async setLastLogin(id) {
        await this.userRepository.update({ id }, { lastLogin: new Date() });
    }
    async setOtpForPhone(phone, code, expiresAt) {
        const user = await this.findByPhone(phone);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.userRepository.update({ id: user.id }, { otpCode: code, otpExpiresAt: expiresAt });
    }
    async verifyOtpForPhone(phone, code) {
        const user = await this.findByPhone(phone);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!user.otpCode || !user.otpExpiresAt)
            return false;
        const isValid = user.otpCode === code && user.otpExpiresAt > new Date();
        if (isValid) {
            await this.userRepository.update({ id: user.id }, { isActive: true, otpCode: null, otpExpiresAt: null });
        }
        return isValid;
    }
    async setOtpForEmail(email, code, expiresAt) {
        const user = await this.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.userRepository.update({ id: user.id }, { otpCode: code, otpExpiresAt: expiresAt });
    }
    async setOtpForPasswordReset(email, code, expiresAt) {
        const user = await this.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.userRepository.update({ id: user.id }, { resetPasswordOtp: code, resetPasswordOtpExpiresAt: expiresAt });
    }
    async verifyOtpForEmail(email, code) {
        const user = await this.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!user.otpCode || !user.otpExpiresAt)
            return false;
        const isValid = user.otpCode === code && user.otpExpiresAt > new Date();
        if (isValid) {
            await this.userRepository.update({ id: user.id }, { isActive: true, otpCode: null, otpExpiresAt: null });
        }
        return isValid;
    }
    async createGoogleUser(googleData) {
        const role = await this.roleRepository.findOne({ where: { name: user_role_enum_1.UserRole.USER } });
        if (!role) {
            throw new common_1.NotFoundException('Default user role not found');
        }
        const user = this.userRepository.create({
            email: googleData.email.toLowerCase(),
            firstName: googleData.firstName,
            lastName: googleData.lastName,
            profilePicture: googleData.profilePicture,
            phone: null,
            password: null,
            role: role,
            isActive: true,
            googleId: googleData.googleId,
        });
        return this.userRepository.save(user);
    }
    async verifyOtpForPasswordReset(email, code) {
        const user = await this.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt)
            return false;
        return user.resetPasswordOtp === code && user.resetPasswordOtpExpiresAt > new Date();
    }
    async resetPassword(email, newPassword) {
        const user = await this.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update({ id: user.id }, {
            password: hashedPassword,
            resetPasswordOtp: null,
            resetPasswordOtpExpiresAt: null
        });
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.findOne(userId);
        if (updateProfileDto.phone) {
            await this.userRepository.update(userId, { phone: updateProfileDto.phone });
        }
        let profile = user.profile;
        if (!profile) {
            profile = this.profileRepository.create({ userId });
        }
        const { phone } = updateProfileDto, profileData = __rest(updateProfileDto, ["phone"]);
        Object.assign(profile, profileData);
        return this.profileRepository.save(profile);
    }
    async uploadAvatar(userId, avatarUrl) {
        return this.updateProfile(userId, { avatar: avatarUrl });
    }
    async getProfile(userId) {
        const user = await this.findOne(userId);
        return user.profile || this.profileRepository.create({ userId });
    }
    async addBadge(userId, badge) {
        const profile = await this.getProfile(userId);
        if (!profile.badges) {
            profile.badges = [];
        }
        if (!profile.badges.includes(badge)) {
            profile.badges.push(badge);
            return this.profileRepository.save(profile);
        }
        return profile;
    }
    async getPublicProfile(id) {
        var _a;
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'createdAt'],
            relations: ['ads', 'profile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            profile: user.profile,
            _count: {
                ads: ((_a = user.ads) === null || _a === void 0 ? void 0 : _a.length) || 0
            }
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map