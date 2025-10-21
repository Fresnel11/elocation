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
exports.AdsService = void 0;
const common_1 = require("@nestjs/common");
const price_alerts_service_1 = require("../price-alerts/price-alerts.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ad_entity_1 = require("./entities/ad.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const notifications_service_1 = require("../notifications/notifications.service");
const locationService_1 = require("../services/locationService");
const cache_service_1 = require("../cache/cache.service");
const recommendations_service_1 = require("../recommendations/recommendations.service");
const ab_testing_service_1 = require("../ab-testing/ab-testing.service");
let AdsService = class AdsService {
    constructor(adRepository, priceAlertsService, notificationsService, cacheService, recommendationsService, abTestingService) {
        this.adRepository = adRepository;
        this.priceAlertsService = priceAlertsService;
        this.notificationsService = notificationsService;
        this.cacheService = cacheService;
        this.recommendationsService = recommendationsService;
        this.abTestingService = abTestingService;
    }
    async create(createAdDto, user) {
        if (!user.isVerified) {
            throw new common_1.ForbiddenException('Vous devez vérifier votre identité pour publier une annonce');
        }
        const whatsappLink = createAdDto.whatsappNumber
            ? `https://wa.me/${createAdDto.whatsappNumber.replace(/\D/g, '')}`
            : undefined;
        const ad = this.adRepository.create(Object.assign(Object.assign({}, createAdDto), { whatsappLink, userId: user.id }));
        const savedAd = await this.adRepository.save(ad);
        await this.invalidateAdsCache();
        this.checkSearchAlerts(savedAd).catch(err => console.error('Erreur vérification alertes:', err));
        return savedAd;
    }
    async findAll(searchAdsDto, userCity, userId) {
        const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice, location, isAvailable, sortBy = 'createdAt', sortOrder = 'DESC', userLatitude, userLongitude, radius = 50, } = searchAdsDto;
        const cacheKey = this.cacheService.generateCacheKey('ads', {
            page, limit, search, categoryId, minPrice, maxPrice, location,
            isAvailable, sortBy, sortOrder, userCity, userLatitude, userLongitude, radius
        });
        const cachedResult = await this.cacheService.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        const skip = (page - 1) * limit;
        let queryBuilder = this.adRepository
            .createQueryBuilder('ad')
            .leftJoinAndSelect('ad.user', 'user')
            .leftJoinAndSelect('ad.category', 'category')
            .leftJoinAndSelect('ad.subCategory', 'subCategory')
            .where('ad.isActive = :isActive AND ad.isAvailable = :isAvailable', {
            isActive: true,
            isAvailable: true
        });
        if (search) {
            queryBuilder.andWhere('(ad.title ILIKE :search OR ad.description ILIKE :search OR ad.location ILIKE :search)', { search: `%${search}%` });
        }
        if (categoryId) {
            queryBuilder.andWhere('ad.categoryId = :categoryId', { categoryId });
        }
        if (minPrice !== undefined) {
            queryBuilder.andWhere('ad.price >= :minPrice', { minPrice });
        }
        if (maxPrice !== undefined) {
            queryBuilder.andWhere('ad.price <= :maxPrice', { maxPrice });
        }
        if (location) {
            queryBuilder.andWhere('ad.location ILIKE :location', { location: `%${location}%` });
        }
        if (isAvailable !== undefined) {
            queryBuilder.andWhere('ad.isAvailable = :isAvailable', { isAvailable });
        }
        let algorithmConfig = null;
        if (userId) {
            const abTest = await this.abTestingService.getAlgorithmForUser(userId);
            if (abTest) {
                algorithmConfig = abTest;
            }
        }
        if ((algorithmConfig === null || algorithmConfig === void 0 ? void 0 : algorithmConfig.algorithm) === 'B') {
            queryBuilder.addSelect('(ad.views * 0.7 + COALESCE(ad.averageRating, 0) * 0.3)', 'popularity_score');
            queryBuilder.orderBy('popularity_score', 'DESC');
        }
        else {
            if (userCity && !location) {
                const nearbyCities = locationService_1.LocationService.getNearbyCities(userCity);
                queryBuilder.addSelect(`CASE 
            WHEN ad.location ILIKE '%${userCity}%' THEN 1
            WHEN ad.location ILIKE ANY(ARRAY[${nearbyCities.map(city => `'%${city}%'`).join(',')}]) THEN 2
            ELSE 3
          END`, 'location_priority');
                queryBuilder.orderBy('location_priority', 'ASC');
            }
        }
        const validSortFields = ['createdAt', 'price', 'title'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        queryBuilder.addOrderBy(`ad.${sortField}`, sortOrder);
        queryBuilder.skip(skip).take(limit);
        const [ads, total] = await queryBuilder.getManyAndCount();
        console.log(`[AdsService] Récupération: ${ads.length} annonces sur ${total} total`);
        console.log(`[AdsService] Première annonce:`, ads[0] ? {
            id: ads[0].id,
            title: ads[0].title,
            photos: ads[0].photos,
            isActive: ads[0].isActive,
            isAvailable: ads[0].isAvailable
        } : 'Aucune annonce');
        const result = {
            ads,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
        const ttl = search || location ? 5 * 60 * 1000 : 15 * 60 * 1000;
        await this.cacheService.set(cacheKey, result, ttl);
        return result;
    }
    async findOne(id, userId) {
        const ad = await this.adRepository.findOne({
            where: { id },
            relations: ['user', 'category', 'subCategory'],
        });
        if (!ad) {
            throw new common_1.NotFoundException('Ad not found');
        }
        await this.adRepository.update(id, { views: () => 'views + 1' });
        if (userId) {
            await this.recommendationsService.trackUserAction(userId, 'view', {
                adId: id,
                categoryId: ad.categoryId,
                location: ad.location,
                priceRange: [ad.price * 0.8, ad.price * 1.2]
            });
        }
        return ad;
    }
    async findUserAds(userId, searchAdsDto) {
        const { page = 1, limit = 10 } = searchAdsDto;
        const skip = (page - 1) * limit;
        const [ads, total] = await this.adRepository.findAndCount({
            where: {
                userId,
                isActive: true,
                isAvailable: true
            },
            relations: ['category', 'subCategory', 'user'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            ads,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async update(id, updateAdDto, user) {
        const ad = await this.findOne(id);
        if (ad.userId !== user.id && user.role.name !== user_role_enum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You can only update your own ads');
        }
        const previousPrice = ad.price;
        const whatsappLink = updateAdDto.whatsappNumber
            ? `https://wa.me/${updateAdDto.whatsappNumber.replace(/\D/g, '')}`
            : ad.whatsappLink;
        Object.assign(ad, Object.assign(Object.assign({}, updateAdDto), { whatsappLink }));
        const updatedAd = await this.adRepository.save(ad);
        if (updateAdDto.price && updateAdDto.price !== previousPrice) {
            await this.priceAlertsService.checkPriceChanges(id, updateAdDto.price, previousPrice);
        }
        return updatedAd;
    }
    async remove(id, user) {
        const ad = await this.findOne(id);
        if (ad.userId !== user.id && user.role.name !== user_role_enum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You can only delete your own ads');
        }
        await this.adRepository.remove(ad);
    }
    async toggleAdStatus(id, user) {
        const ad = await this.findOne(id);
        if (ad.userId !== user.id && user.role.name !== user_role_enum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You can only toggle your own ads');
        }
        ad.isActive = !ad.isActive;
        return this.adRepository.save(ad);
    }
    async redirectToWhatsapp(id) {
        const ad = await this.findOne(id);
        if (!ad.whatsappLink) {
            throw new common_1.BadRequestException('WhatsApp contact not available for this ad');
        }
        return { whatsappLink: ad.whatsappLink };
    }
    async uploadPhotos(id, photos, user) {
        const ad = await this.findOne(id);
        if (ad.userId !== user.id && user.role.name !== user_role_enum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You can only update photos for your own ads');
        }
        if (photos.length > 5) {
            throw new common_1.BadRequestException('Maximum 5 photos allowed');
        }
        ad.photos = photos;
        return this.adRepository.save(ad);
    }
    async checkSearchAlerts(ad) {
    }
    async invalidateAdsCache() {
    }
    async debugCount() {
        const count = await this.adRepository.count();
        console.log(`[AdsService] Total annonces en base: ${count}`);
        return count;
    }
};
exports.AdsService = AdsService;
exports.AdsService = AdsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        price_alerts_service_1.PriceAlertsService,
        notifications_service_1.NotificationsService,
        cache_service_1.CacheService,
        recommendations_service_1.RecommendationsService,
        ab_testing_service_1.ABTestingService])
], AdsService);
//# sourceMappingURL=ads.service.js.map