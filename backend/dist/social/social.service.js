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
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const social_share_entity_1 = require("./entities/social-share.entity");
const user_interaction_entity_1 = require("./entities/user-interaction.entity");
const ad_entity_1 = require("../ads/entities/ad.entity");
let SocialService = class SocialService {
    constructor(socialShareRepository, userInteractionRepository, adRepository) {
        this.socialShareRepository = socialShareRepository;
        this.userInteractionRepository = userInteractionRepository;
        this.adRepository = adRepository;
    }
    async trackShare(userId, adId, platform) {
        const share = this.socialShareRepository.create({
            userId,
            adId,
            platform,
        });
        await this.socialShareRepository.save(share);
        await this.trackInteraction(userId, adId, user_interaction_entity_1.InteractionType.SHARE);
    }
    async trackInteraction(userId, adId, type, metadata) {
        const interaction = this.userInteractionRepository.create({
            userId,
            adId,
            type,
            metadata,
        });
        await this.userInteractionRepository.save(interaction);
    }
    async getShareStats(adId) {
        const shares = await this.socialShareRepository.find({ where: { adId } });
        const byPlatform = shares.reduce((acc, share) => {
            acc[share.platform] = (acc[share.platform] || 0) + 1;
            return acc;
        }, {});
        return {
            total: shares.length,
            byPlatform,
        };
    }
    async getRecommendations(userId, limit = 10) {
        const userInteractions = await this.userInteractionRepository.find({
            where: { userId },
            relations: ['ad', 'ad.category'],
            order: { createdAt: 'DESC' },
            take: 50,
        });
        if (userInteractions.length === 0) {
            return this.getPopularAds(limit);
        }
        const categoryPreferences = this.analyzeCategoryPreferences(userInteractions);
        const locationPreferences = this.analyzeLocationPreferences(userInteractions);
        const priceRange = this.analyzePriceRange(userInteractions);
        const queryBuilder = this.adRepository.createQueryBuilder('ad')
            .leftJoinAndSelect('ad.category', 'category')
            .leftJoinAndSelect('ad.user', 'user')
            .where('ad.isActive = :isActive', { isActive: true })
            .andWhere('ad.isAvailable = :isAvailable', { isAvailable: true })
            .andWhere('ad.userId != :userId', { userId });
        if (categoryPreferences.length > 0) {
            queryBuilder.andWhere('ad.categoryId IN (:...categories)', { categories: categoryPreferences });
        }
        if (locationPreferences.length > 0) {
            const locationConditions = locationPreferences.map((loc, index) => `ad.location ILIKE :location${index}`).join(' OR ');
            queryBuilder.andWhere(`(${locationConditions})`);
            locationPreferences.forEach((loc, index) => {
                queryBuilder.setParameter(`location${index}`, `%${loc}%`);
            });
        }
        if (priceRange.min && priceRange.max) {
            queryBuilder.andWhere('ad.price BETWEEN :minPrice AND :maxPrice', {
                minPrice: priceRange.min,
                maxPrice: priceRange.max,
            });
        }
        return queryBuilder
            .orderBy('ad.createdAt', 'DESC')
            .limit(limit)
            .getMany();
    }
    async getPopularAds(limit) {
        const popularAdIds = await this.userInteractionRepository
            .createQueryBuilder('interaction')
            .select('interaction.adId', 'adId')
            .addSelect('COUNT(*)', 'interactionCount')
            .where('interaction.createdAt > :date', { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) })
            .groupBy('interaction.adId')
            .orderBy('interactionCount', 'DESC')
            .limit(limit)
            .getRawMany();
        if (popularAdIds.length === 0) {
            return this.adRepository.find({
                where: { isActive: true, isAvailable: true },
                relations: ['category', 'user'],
                order: { createdAt: 'DESC' },
                take: limit,
            });
        }
        const adIds = popularAdIds.map(item => item.adId);
        return this.adRepository.find({
            where: { id: (0, typeorm_2.In)(adIds) },
            relations: ['category', 'user'],
        });
    }
    analyzeCategoryPreferences(interactions) {
        const categoryCount = interactions.reduce((acc, interaction) => {
            var _a;
            const categoryId = (_a = interaction.ad) === null || _a === void 0 ? void 0 : _a.categoryId;
            if (categoryId) {
                acc[categoryId] = (acc[categoryId] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(categoryCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([categoryId]) => categoryId);
    }
    analyzeLocationPreferences(interactions) {
        const locationCount = interactions.reduce((acc, interaction) => {
            var _a;
            const location = (_a = interaction.ad) === null || _a === void 0 ? void 0 : _a.location;
            if (location) {
                const city = location.split(',')[0].trim();
                acc[city] = (acc[city] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(locationCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([location]) => location);
    }
    analyzePriceRange(interactions) {
        const prices = interactions
            .map(interaction => { var _a; return (_a = interaction.ad) === null || _a === void 0 ? void 0 : _a.price; })
            .filter(price => price != null)
            .map(price => Number(price));
        if (prices.length === 0)
            return {};
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const margin = avgPrice * 0.3;
        return {
            min: Math.max(0, avgPrice - margin),
            max: avgPrice + margin,
        };
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(social_share_entity_1.SocialShare)),
    __param(1, (0, typeorm_1.InjectRepository)(user_interaction_entity_1.UserInteraction)),
    __param(2, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SocialService);
//# sourceMappingURL=social.service.js.map