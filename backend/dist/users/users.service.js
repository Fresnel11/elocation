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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
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
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            email: createUserDto.email ? createUserDto.email.toLowerCase() : null,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            phone: createUserDto.phone,
            password: hashedPassword,
            profilePicture: (_a = createUserDto.profilePicture) !== null && _a !== void 0 ? _a : null,
            birthDate: createUserDto.birthDate ? new Date(createUserDto.birthDate) : null,
            role: createUserDto.role,
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
            relations: ['ads', 'payments'],
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
        });
    }
    async findByPhone(phone) {
        return this.userRepository.findOne({ where: { phone } });
    }
    async update(id, updateUserDto) {
        var _a, _b, _c, _d, _e;
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
        Object.assign(user, {
            email: updateUserDto.email ? updateUserDto.email.toLowerCase() : user.email,
            firstName: (_a = updateUserDto.firstName) !== null && _a !== void 0 ? _a : user.firstName,
            lastName: (_b = updateUserDto.lastName) !== null && _b !== void 0 ? _b : user.lastName,
            phone: (_c = updateUserDto.phone) !== null && _c !== void 0 ? _c : user.phone,
            profilePicture: (_d = updateUserDto.profilePicture) !== null && _d !== void 0 ? _d : user.profilePicture,
            birthDate: updateUserDto.birthDate ? new Date(updateUserDto.birthDate) : user.birthDate,
            role: (_e = updateUserDto.role) !== null && _e !== void 0 ? _e : user.role,
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map