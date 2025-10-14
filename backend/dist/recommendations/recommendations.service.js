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
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_preference_entity_1 = require("./entities/user-preference.entity");
const ad_entity_1 = require("../ads/entities/ad.entity");
let RecommendationsService = class RecommendationsService {
    constructor(userPreferenceRepository, adRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
        this.adRepository = adRepository;
    }
    async trackUserAction(userId, type, data) {
        const preference = this.userPreferenceRepository.create({
            userId,
            type,
            data,
            weight: this.getActionWeight(type)
        });
        await this.userPreferenceRepository.save(preference);
    }
    async getRecommendedAds(userId, limit = 10) {
        const preferences = await this.getUserPreferences(userId);
        if (preferences.length === 0) {
            return this.getPopularAds(limit);
        }
        const scores = await this.calculateAdScores(preferences);
        const topAdIds = Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);
        if (topAdIds.length === 0) {
            return this.getPopularAds(limit);
        }
        return this.adRepository
            .createQueryBuilder('ad')
            .leftJoinAndSelect('ad.user', 'user')
            .leftJoinAndSelect('ad.category', 'category')
            .where('ad.id IN (:...ids)', { ids: topAdIds })
            .andWhere('ad.isActive = true')
            .andWhere('ad.isAvailable = true')
            .getMany();
    }
    async getUserPreferences(userId) {
        return this.userPreferenceRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 100
        });
    }
    async calculateAdScores(preferences) {
        const scores = {};
        const categoryWeights = {};
        const locationWeights = {};
        preferences.forEach(pref => {
            if (pref.data.categoryId) {
                categoryWeights[pref.data.categoryId] = (categoryWeights[pref.data.categoryId] || 0) + pref.weight;
            }
            if (pref.data.location) {
                locationWeights[pref.data.location] = (locationWeights[pref.data.location] || 0) + pref.weight;
            }
        });
        const ads = await this.adRepository.find({
            where: { isActive: true, isAvailable: true },
            relations: ['category']
        });
        ads.forEach(ad => {
            let score = 0;
            if (categoryWeights[ad.categoryId]) {
                score += categoryWeights[ad.categoryId] * 0.4;
            }
            const locationMatch = Object.keys(locationWeights).find(loc => ad.location.toLowerCase().includes(loc.toLowerCase()));
            if (locationMatch) {
                score += locationWeights[locationMatch] * 0.3;
            }
            const daysSinceCreated = (Date.now() - new Date(ad.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            score += Math.max(0, (30 - daysSinceCreated) / 30) * 0.3;
            scores[ad.id] = score;
        });
        return scores;
    }
    async getPopularAds(limit) {
        return this.adRepository
            .createQueryBuilder('ad')
            .leftJoinAndSelect('ad.user', 'user')
            .leftJoinAndSelect('ad.category', 'category')
            .where('ad.isActive = true')
            .andWhere('ad.isAvailable = true')
            .orderBy('ad.views', 'DESC')
            .addOrderBy('ad.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }
    getActionWeight(type) {
        const weights = {
            'view': 1,
            'favorite': 3,
            'contact': 5,
            'search': 2
        };
        return weights[type] || 1;
    }
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_preference_entity_1.UserPreference)),
    __param(1, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RecommendationsService);
//# sourceMappingURL=recommendations.service.js.map