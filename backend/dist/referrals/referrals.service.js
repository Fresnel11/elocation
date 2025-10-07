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
exports.ReferralsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const referral_entity_1 = require("./entities/referral.entity");
const loyalty_points_entity_1 = require("./entities/loyalty-points.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ReferralsService = class ReferralsService {
    constructor(referralRepository, loyaltyPointsRepository, userRepository) {
        this.referralRepository = referralRepository;
        this.loyaltyPointsRepository = loyaltyPointsRepository;
        this.userRepository = userRepository;
    }
    async generateReferralCode(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        const code = `${user.firstName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const existing = await this.referralRepository.findOne({ where: { referralCode: code } });
        if (existing)
            return this.generateReferralCode(userId);
        return code;
    }
    async useReferralCode(referralCode, newUserId) {
        const referrer = await this.userRepository.findOne({ where: { referralCode } });
        if (!referrer)
            throw new common_1.BadRequestException('Code de parrainage invalide');
        if (referrer.id === newUserId)
            throw new common_1.BadRequestException('Vous ne pouvez pas utiliser votre propre code');
        const existing = await this.referralRepository.findOne({ where: { referredId: newUserId } });
        if (existing)
            throw new common_1.BadRequestException('Vous avez déjà utilisé un code de parrainage');
        const referral = this.referralRepository.create({
            referrerId: referrer.id,
            referredId: newUserId,
            referralCode,
            status: referral_entity_1.ReferralStatus.PENDING,
        });
        return this.referralRepository.save(referral);
    }
    async completeReferral(referredUserId) {
        const referral = await this.referralRepository.findOne({
            where: { referredId: referredUserId, status: referral_entity_1.ReferralStatus.PENDING },
            relations: ['referrer', 'referred']
        });
        if (!referral)
            return;
        referral.status = referral_entity_1.ReferralStatus.COMPLETED;
        referral.rewardAmount = 5000;
        await this.referralRepository.save(referral);
        await this.addLoyaltyPoints(referral.referrerId, loyalty_points_entity_1.PointType.REFERRAL, 100, 'Parrainage réussi', referral.id);
        await this.addLoyaltyPoints(referredUserId, loyalty_points_entity_1.PointType.REFERRAL, 50, 'Inscription via parrainage', referral.id);
    }
    async addLoyaltyPoints(userId, type, points, description, referenceId) {
        const loyaltyPoints = this.loyaltyPointsRepository.create({
            userId,
            type,
            points,
            description,
            referenceId,
        });
        await this.loyaltyPointsRepository.save(loyaltyPoints);
    }
    async getUserLoyaltyPoints(userId) {
        const history = await this.loyaltyPointsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        const total = history.reduce((sum, point) => sum + point.points, 0);
        return { total, history };
    }
    async getUserReferrals(userId) {
        return this.referralRepository.find({
            where: { referrerId: userId },
            relations: ['referred'],
            order: { createdAt: 'DESC' },
        });
    }
    async getReferralStats(userId) {
        const referrals = await this.referralRepository.find({ where: { referrerId: userId } });
        return {
            totalReferrals: referrals.length,
            completedReferrals: referrals.filter(r => r.status === referral_entity_1.ReferralStatus.COMPLETED).length,
            totalRewards: referrals.reduce((sum, r) => sum + Number(r.rewardAmount), 0),
        };
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(referral_entity_1.Referral)),
    __param(1, (0, typeorm_1.InjectRepository)(loyalty_points_entity_1.LoyaltyPoints)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReferralsService);
//# sourceMappingURL=referrals.service.js.map