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
const payment_entity_1 = require("../payments/entities/payment.entity");
const payment_status_enum_1 = require("../common/enums/payment-status.enum");
let AdminService = class AdminService {
    constructor(userRepository, adRepository, paymentRepository) {
        this.userRepository = userRepository;
        this.adRepository = adRepository;
        this.paymentRepository = paymentRepository;
    }
    async getDashboardStats() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [totalUsers, totalAds, totalPayments, activeAds, pendingPayments, recentUsers, recentAds, completedPayments,] = await Promise.all([
            this.userRepository.count(),
            this.adRepository.count(),
            this.paymentRepository.count(),
            this.adRepository.count({ where: { isActive: true } }),
            this.paymentRepository.count({ where: { status: payment_status_enum_1.PaymentStatus.PENDING } }),
            this.userRepository.count({ where: { createdAt: thirtyDaysAgo } }),
            this.adRepository.count({ where: { createdAt: thirtyDaysAgo } }),
            this.paymentRepository.find({
                where: { status: payment_status_enum_1.PaymentStatus.COMPLETED },
                select: ['amount'],
            }),
        ]);
        const totalRevenue = completedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        return {
            totalUsers,
            totalAds,
            totalPayments,
            totalRevenue,
            activeAds,
            pendingPayments,
            recentUsers,
            recentAds,
        };
    }
    async moderateAd(adId, action) {
        const ad = await this.adRepository.findOne({ where: { id: adId } });
        if (!ad) {
            throw new Error('Ad not found');
        }
        ad.isActive = action === 'approve';
        return this.adRepository.save(ad);
    }
    async getPendingAds() {
        return this.adRepository.find({
            where: { isActive: false },
            relations: ['user', 'category'],
            order: { createdAt: 'DESC' },
        });
    }
    async getRecentUsers(limit = 10) {
        return this.userRepository.find({
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }
    async getRecentPayments(limit = 10) {
        return this.paymentRepository.find({
            relations: ['user'],
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map