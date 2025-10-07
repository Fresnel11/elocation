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
exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const social_service_1 = require("./social.service");
const social_share_entity_1 = require("./entities/social-share.entity");
const user_interaction_entity_1 = require("./entities/user-interaction.entity");
let SocialController = class SocialController {
    constructor(socialService) {
        this.socialService = socialService;
    }
    async trackShare(req, adId, platform) {
        await this.socialService.trackShare(req.user.id, adId, platform);
        return { success: true };
    }
    async trackInteraction(req, adId, type, metadata) {
        await this.socialService.trackInteraction(req.user.id, adId, type, metadata);
        return { success: true };
    }
    async getShareStats(adId) {
        return this.socialService.getShareStats(adId);
    }
    async getRecommendations(req, limit = 10) {
        return this.socialService.getRecommendations(req.user.id, Number(limit));
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.Post)('share'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer un partage' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('adId')),
    __param(2, (0, common_1.Body)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "trackShare", null);
__decorate([
    (0, common_1.Post)('interaction'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer une interaction' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('adId')),
    __param(2, (0, common_1.Body)('type')),
    __param(3, (0, common_1.Body)('metadata')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "trackInteraction", null);
__decorate([
    (0, common_1.Get)('share-stats/:adId'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques de partage d\'une annonce' }),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getShareStats", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Recommandations personnalisées' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getRecommendations", null);
exports.SocialController = SocialController = __decorate([
    (0, swagger_1.ApiTags)('Social'),
    (0, common_1.Controller)('social'),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialController);
//# sourceMappingURL=social.controller.js.map