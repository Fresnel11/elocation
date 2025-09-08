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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ad_entity_1 = require("./entities/ad.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const geocoding_service_1 = require("../common/services/geocoding.service");
let AdsService = class AdsService {
    constructor(adRepository, geocodingService) {
        this.adRepository = adRepository;
        this.geocodingService = geocodingService;
    }
    async create(createAdDto, user) {
        const whatsappLink = createAdDto.whatsappNumber
            ? `https://wa.me/${createAdDto.whatsappNumber.replace(/\D/g, '')}`
            : undefined;
        const coordinates = this.geocodingService.extractCoordinates(createAdDto.location);
        const ad = this.adRepository.create(Object.assign(Object.assign({}, createAdDto), { whatsappLink, latitude: (coordinates === null || coordinates === void 0 ? void 0 : coordinates.latitude) || null, longitude: (coordinates === null || coordinates === void 0 ? void 0 : coordinates.longitude) || null, userId: user.id }));
        return this.adRepository.save(ad);
    }
    async findAll(searchAdsDto) {
        const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice, location, isAvailable, sortBy = 'createdAt', sortOrder = 'DESC', userLatitude, userLongitude, radius = 50, } = searchAdsDto;
        const skip = (page - 1) * limit;
        let queryBuilder = this.adRepository
            .createQueryBuilder('ad')
            .leftJoinAndSelect('ad.user', 'user')
            .leftJoinAndSelect('ad.category', 'category')
            .leftJoinAndSelect('ad.subCategory', 'subCategory')
            .where('ad.isActive = :isActive', { isActive: true });
        if (userLatitude && userLongitude) {
            const searchRadius = radius > 100 ? 200 : radius;
            queryBuilder.andWhere(`(
          ad.latitude IS NULL OR ad.longitude IS NULL OR
          (
            6371 * acos(
              cos(radians(:userLat)) * 
              cos(radians(ad.latitude)) * 
              cos(radians(ad.longitude) - radians(:userLng)) + 
              sin(radians(:userLat)) * 
              sin(radians(ad.latitude))
            )
          ) <= :radius
        )`, {
                userLat: userLatitude,
                userLng: userLongitude,
                radius: searchRadius,
            });
            queryBuilder.addSelect(`CASE 
          WHEN ad.latitude IS NULL OR ad.longitude IS NULL THEN 999999
          ELSE (
            6371 * acos(
              cos(radians(:userLat)) * 
              cos(radians(ad.latitude)) * 
              cos(radians(ad.longitude) - radians(:userLng)) + 
              sin(radians(:userLat)) * 
              sin(radians(ad.latitude))
            )
          )
        END`, 'distance');
        }
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
        const validSortFields = ['createdAt', 'price', 'title', 'distance'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        if (sortField === 'distance' && userLatitude && userLongitude) {
            queryBuilder.orderBy('distance', sortOrder);
        }
        else {
            queryBuilder.orderBy(`ad.${sortField}`, sortOrder);
        }
        queryBuilder.skip(skip).take(limit);
        const [ads, total] = await queryBuilder.getManyAndCount();
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
    async findOne(id) {
        const ad = await this.adRepository.findOne({
            where: { id },
            relations: ['user', 'category', 'subCategory'],
        });
        if (!ad) {
            throw new common_1.NotFoundException('Ad not found');
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
        const whatsappLink = updateAdDto.whatsappNumber
            ? `https://wa.me/${updateAdDto.whatsappNumber.replace(/\D/g, '')}`
            : ad.whatsappLink;
        Object.assign(ad, Object.assign(Object.assign({}, updateAdDto), { whatsappLink }));
        return this.adRepository.save(ad);
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
};
exports.AdsService = AdsService;
exports.AdsService = AdsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        geocoding_service_1.GeocodingService])
], AdsService);
//# sourceMappingURL=ads.service.js.map