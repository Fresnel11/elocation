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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const ad_entity_1 = require("../ads/entities/ad.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, adRepository, userRepository) {
        this.reviewRepository = reviewRepository;
        this.adRepository = adRepository;
        this.userRepository = userRepository;
    }
    async create(createReviewDto, userId) {
        const ad = await this.adRepository.findOne({
            where: { id: createReviewDto.adId },
            relations: ['user']
        });
        if (!ad) {
            throw new common_1.NotFoundException('Annonce non trouvée');
        }
        if (ad.user.id === userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez pas évaluer votre propre annonce');
        }
        const existingReviewsCount = await this.reviewRepository.count({
            where: {
                ad: { id: createReviewDto.adId },
                user: { id: userId }
            }
        });
        if (existingReviewsCount >= 2) {
            throw new common_1.ForbiddenException('Vous ne pouvez pas ajouter plus de 2 avis par annonce');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const review = this.reviewRepository.create({
            rating: createReviewDto.rating,
            comment: createReviewDto.comment,
            user: user,
            ad: { id: createReviewDto.adId }
        });
        const savedReview = await this.reviewRepository.save(review);
        return this.reviewRepository.findOne({
            where: { id: savedReview.id },
            relations: ['user'],
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            }
        });
    }
    async findByAd(adId) {
        return this.reviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .where('review.adId = :adId', { adId })
            .select([
            'review.id',
            'review.rating',
            'review.comment',
            'review.createdAt',
            'review.updatedAt',
            'user.id',
            'user.firstName',
            'user.lastName'
        ])
            .orderBy('review.createdAt', 'DESC')
            .getMany();
    }
    async getAdRating(adId) {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'averageRating')
            .addSelect('COUNT(review.id)', 'totalReviews')
            .where('review.adId = :adId', { adId })
            .getRawOne();
        return {
            averageRating: parseFloat(result.averageRating) || 0,
            totalReviews: parseInt(result.totalReviews) || 0
        };
    }
    async getPendingReviews() {
        return this.reviewRepository.find({
            where: { status: review_entity_1.ReviewStatus.PENDING },
            relations: ['user', 'ad'],
            select: {
                id: true,
                rating: true,
                comment: true,
                status: true,
                createdAt: true,
                user: {
                    id: true,
                    firstName: true,
                    lastName: true
                },
                ad: {
                    id: true,
                    title: true
                }
            },
            order: { createdAt: 'DESC' }
        });
    }
    async approveReview(id) {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review) {
            throw new common_1.NotFoundException('Avis non trouvé');
        }
        review.status = review_entity_1.ReviewStatus.APPROVED;
        return this.reviewRepository.save(review);
    }
    async rejectReview(id) {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review) {
            throw new common_1.NotFoundException('Avis non trouvé');
        }
        review.status = review_entity_1.ReviewStatus.REJECTED;
        return this.reviewRepository.save(review);
    }
    async getUserReviews(userId) {
        return this.reviewRepository.find({
            where: {
                ad: { user: { id: userId } },
                status: review_entity_1.ReviewStatus.APPROVED
            },
            relations: ['user', 'ad'],
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: {
                    id: true,
                    firstName: true,
                    lastName: true
                },
                ad: {
                    id: true,
                    title: true
                }
            },
            order: { createdAt: 'DESC' }
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map