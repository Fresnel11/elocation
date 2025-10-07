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
exports.ReferralsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const referrals_service_1 = require("./referrals.service");
let ReferralsController = class ReferralsController {
    constructor(referralsService) {
        this.referralsService = referralsService;
    }
    async getMyReferralCode(req) {
        const code = await this.referralsService.generateReferralCode(req.user.id);
        return { referralCode: code };
    }
    async useReferralCode(req, code) {
        const referral = await this.referralsService.useReferralCode(code, req.user.id);
        return { success: true, referral };
    }
    async getMyReferrals(req) {
        return this.referralsService.getUserReferrals(req.user.id);
    }
    async getReferralStats(req) {
        return this.referralsService.getReferralStats(req.user.id);
    }
    async getLoyaltyPoints(req) {
        return this.referralsService.getUserLoyaltyPoints(req.user.id);
    }
};
exports.ReferralsController = ReferralsController;
__decorate([
    (0, common_1.Get)('my-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir mon code de parrainage' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getMyReferralCode", null);
__decorate([
    (0, common_1.Post)('use-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Utiliser un code de parrainage' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "useReferralCode", null);
__decorate([
    (0, common_1.Get)('my-referrals'),
    (0, swagger_1.ApiOperation)({ summary: 'Mes parrainages' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getMyReferrals", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques de parrainage' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getReferralStats", null);
__decorate([
    (0, common_1.Get)('loyalty-points'),
    (0, swagger_1.ApiOperation)({ summary: 'Points de fidélité' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getLoyaltyPoints", null);
exports.ReferralsController = ReferralsController = __decorate([
    (0, swagger_1.ApiTags)('Referrals'),
    (0, common_1.Controller)('referrals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [referrals_service_1.ReferralsService])
], ReferralsController);
//# sourceMappingURL=referrals.controller.js.map