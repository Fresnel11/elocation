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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const ad_entity_1 = require("../ads/entities/ad.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const system_setting_entity_1 = require("./entities/system-setting.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const bcrypt = require("bcrypt");
let AdminService = class AdminService {
    constructor(userRepository, adRepository, bookingRepository, systemSettingRepository, activityLogRepository, roleRepository, permissionRepository) {
        this.userRepository = userRepository;
        this.adRepository = adRepository;
        this.bookingRepository = bookingRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.activityLogRepository = activityLogRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async getDashboardStats() {
        const [totalUsers, totalAds, totalBookings, activeUsers, pendingAds, recentUsers,] = await Promise.all([
            this.userRepository.count(),
            this.adRepository.count(),
            this.bookingRepository.count(),
            this.userRepository.count({ where: { isActive: true } }),
            this.adRepository.count({ where: { isActive: false } }),
            this.userRepository.find({
                order: { createdAt: 'DESC' },
                take: 5,
                relations: ['role'],
            }),
        ]);
        return {
            totalUsers,
            totalAds,
            totalBookings,
            activeUsers,
            inactiveAds: pendingAds,
            recentUsers,
        };
    }
    async getUsersStats() {
        const usersByRole = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.role', 'role')
            .select('role.name', 'role')
            .addSelect('COUNT(user.id)', 'count')
            .groupBy('role.name')
            .getRawMany();
        const usersThisMonth = await this.userRepository
            .createQueryBuilder('user')
            .where('user.createdAt >= :startOfMonth', {
            startOfMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        })
            .getCount();
        return {
            usersByRole,
            usersThisMonth,
        };
    }
    async getAllUsers(page = 1, limit = 20, search, role, status) {
        const query = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .orderBy('user.createdAt', 'DESC');
        if (search) {
            query.andWhere('(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)', { search: `%${search}%` });
        }
        if (role) {
            query.andWhere('role.name = :role', { role });
        }
        if (status === 'active') {
            query.andWhere('user.isActive = :isActive', { isActive: true });
        }
        else if (status === 'inactive') {
            query.andWhere('user.isActive = :isActive', { isActive: false });
        }
        const [users, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getUserDetails(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role', 'ads', 'payments'],
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const userAdsCount = await this.adRepository.count({ where: { user: { id: userId } } });
        const userBookingsCount = await this.bookingRepository.count({
            where: [{ tenant: { id: userId } }, { owner: { id: userId } }]
        });
        return Object.assign(Object.assign({}, user), { stats: {
                adsCount: userAdsCount,
                bookingsCount: userBookingsCount,
            } });
    }
    async updateUserStatus(userId, isActive) {
        await this.userRepository.update(userId, { isActive });
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role']
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }
    async updateUserRole(userId, roleId) {
        await this.userRepository.update(userId, { roleId });
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role']
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }
    async deleteUser(userId) {
        const adsCount = await this.adRepository.count({ where: { user: { id: userId } } });
        const bookingsCount = await this.bookingRepository.count({
            where: [{ tenant: { id: userId } }, { owner: { id: userId } }]
        });
        if (adsCount > 0 || bookingsCount > 0) {
            throw new Error('Impossible de supprimer un utilisateur avec des annonces ou réservations actives');
        }
        await this.userRepository.delete(userId);
    }
    async getAllAds(page = 1, limit = 20, search, status, category) {
        const query = this.adRepository.createQueryBuilder('ad')
            .leftJoinAndSelect('ad.user', 'user')
            .leftJoinAndSelect('ad.category', 'category')
            .orderBy('ad.createdAt', 'DESC');
        if (search) {
            query.andWhere('(ad.title LIKE :search OR ad.description LIKE :search OR ad.location LIKE :search)', { search: `%${search}%` });
        }
        if (status === 'active') {
            query.andWhere('ad.isActive = :isActive', { isActive: true });
        }
        else if (status === 'inactive') {
            query.andWhere('ad.isActive = :isActive', { isActive: false });
        }
        if (category) {
            query.andWhere('category.id = :category', { category });
        }
        const [ads, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: ads,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateAdStatus(adId, status, reason) {
        const isActive = status === 'active';
        await this.adRepository.update(adId, { isActive });
        return this.adRepository.findOne({
            where: { id: adId },
            relations: ['user', 'category']
        });
    }
    async deleteAd(adId) {
        const activeBookings = await this.bookingRepository.count({
            where: { ad: { id: adId }, status: booking_entity_1.BookingStatus.CONFIRMED }
        });
        if (activeBookings > 0) {
            throw new Error('Impossible de supprimer une annonce avec des réservations actives');
        }
        await this.adRepository.delete(adId);
    }
    async getAllBookings(page = 1, limit = 20, status, search) {
        const query = this.bookingRepository.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.ad', 'ad')
            .leftJoinAndSelect('booking.tenant', 'tenant')
            .leftJoinAndSelect('booking.owner', 'owner')
            .orderBy('booking.createdAt', 'DESC');
        if (status) {
            query.andWhere('booking.status = :status', { status });
        }
        if (search) {
            query.andWhere('(ad.title LIKE :search OR tenant.firstName LIKE :search OR tenant.lastName LIKE :search)', { search: `%${search}%` });
        }
        const [bookings, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateBookingStatus(bookingId, status, reason) {
        const bookingStatus = status;
        const updateData = { status: bookingStatus };
        if (reason) {
            updateData.cancellationReason = reason;
        }
        await this.bookingRepository.update(bookingId, updateData);
        return this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['ad', 'tenant', 'owner']
        });
    }
    async getSystemSettings() {
        return this.systemSettingRepository.find({
            order: { key: 'ASC' }
        });
    }
    async getPublicSettings() {
        return this.systemSettingRepository.find({
            where: { isPublic: true },
            order: { key: 'ASC' }
        });
    }
    async updateSystemSetting(key, value, type = 'string') {
        let setting = await this.systemSettingRepository.findOne({ where: { key } });
        if (setting) {
            setting.value = value;
            setting.type = type;
        }
        else {
            setting = this.systemSettingRepository.create({ key, value, type });
        }
        return this.systemSettingRepository.save(setting);
    }
    async initializeDefaultSettings() {
        const defaultSettings = [
            { key: 'app_name', value: 'eLocation', type: 'string', isPublic: true, description: 'Nom de l\'application' },
            { key: 'app_description', value: 'Plateforme de location au Bénin', type: 'string', isPublic: true, description: 'Description de l\'application' },
            { key: 'commission_rate', value: '5', type: 'number', isPublic: false, description: 'Taux de commission (%)' },
            { key: 'max_photos_per_ad', value: '5', type: 'number', isPublic: true, description: 'Nombre max de photos par annonce' },
            { key: 'auto_approve_ads', value: 'false', type: 'boolean', isPublic: false, description: 'Approbation automatique des annonces' },
            { key: 'maintenance_mode', value: 'false', type: 'boolean', isPublic: true, description: 'Mode maintenance' },
            { key: 'contact_email', value: 'contact@elocation.bj', type: 'string', isPublic: true, description: 'Email de contact' },
        ];
        for (const setting of defaultSettings) {
            const exists = await this.systemSettingRepository.findOne({ where: { key: setting.key } });
            if (!exists) {
                await this.systemSettingRepository.save(setting);
            }
        }
    }
    async getActivityLogs(page = 1, limit = 50, userId, action) {
        const query = this.activityLogRepository.createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user')
            .orderBy('log.createdAt', 'DESC');
        if (userId) {
            query.andWhere('log.userId = :userId', { userId });
        }
        if (action) {
            query.andWhere('log.action = :action', { action });
        }
        const [logs, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async logActivity(action, entity, entityId, userId, oldData, newData, ipAddress, userAgent) {
        const log = this.activityLogRepository.create({
            action,
            entity,
            entityId,
            userId,
            oldData,
            newData,
            ipAddress,
            userAgent,
        });
        return this.activityLogRepository.save(log);
    }
    async getSystemStats() {
        const [totalLogs, recentLogs] = await Promise.all([
            this.activityLogRepository.count(),
            this.activityLogRepository.count({
                where: {
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            })
        ]);
        return {
            totalLogs,
            recentLogs,
        };
    }
    async getAnalytics() {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const usersGrowth = await this.userRepository
            .createQueryBuilder('user')
            .select('DATE_FORMAT(user.createdAt, "%Y-%m")', 'month')
            .addSelect('COUNT(user.id)', 'count')
            .where('user.createdAt >= :sixMonthsAgo', {
            sixMonthsAgo: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
        const adsGrowth = await this.adRepository
            .createQueryBuilder('ad')
            .select('DATE_FORMAT(ad.createdAt, "%Y-%m")', 'month')
            .addSelect('COUNT(ad.id)', 'count')
            .where('ad.createdAt >= :sixMonthsAgo', {
            sixMonthsAgo: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
        const topCategories = await this.adRepository
            .createQueryBuilder('ad')
            .leftJoin('ad.category', 'category')
            .select('category.name', 'category')
            .addSelect('COUNT(ad.id)', 'count')
            .groupBy('category.id')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();
        const bookingsStats = await this.bookingRepository
            .createQueryBuilder('booking')
            .select('booking.status', 'status')
            .addSelect('COUNT(booking.id)', 'count')
            .groupBy('booking.status')
            .getRawMany();
        return {
            usersGrowth,
            adsGrowth,
            topCategories,
            bookingsStats,
        };
    }
    async createUser(userData) {
        const { firstName, lastName, email, phone, password, role } = userData;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }
        const userRole = await this.roleRepository.findOne({ where: { name: role } });
        if (!userRole) {
            throw new Error('Rôle invalide');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role: userRole,
            isActive: true,
        });
        return this.userRepository.save(user);
    }
    async getAllPermissions() {
        return this.permissionRepository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async createPermission(permissionData) {
        const { name, description } = permissionData;
        const existingPermission = await this.permissionRepository.findOne({ where: { name } });
        if (existingPermission) {
            throw new Error('Une permission avec ce nom existe déjà');
        }
        const permission = this.permissionRepository.create({
            name,
            description,
            isSystemPermission: false,
        });
        return this.permissionRepository.save(permission);
    }
    async deletePermission(permissionId) {
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
        if (!permission) {
            throw new Error('Permission non trouvée');
        }
        if (permission.isSystemPermission) {
            throw new Error('Impossible de supprimer une permission système');
        }
        await this.permissionRepository.delete(permissionId);
    }
    async getRolesWithPermissions() {
        return this.roleRepository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .orderBy('role.name', 'ASC')
            .getMany();
    }
    async updateRolePermissions(roleId, permissionIds) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions']
        });
        if (!role) {
            throw new Error('Rôle non trouvé');
        }
        const permissions = await this.permissionRepository.findByIds(permissionIds);
        role.permissions = permissions;
        return this.roleRepository.save(role);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(3, (0, typeorm_1.InjectRepository)(system_setting_entity_1.SystemSetting)),
    __param(4, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __param(5, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(6, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map