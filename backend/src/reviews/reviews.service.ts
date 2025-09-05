import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Ad } from '../ads/entities/ad.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const ad = await this.adRepository.findOne({
      where: { id: createReviewDto.adId },
      relations: ['user']
    });

    if (!ad) {
      throw new NotFoundException('Annonce non trouvée');
    }

    if (ad.user.id === userId) {
      throw new ForbiddenException('Vous ne pouvez pas évaluer votre propre annonce');
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await this.reviewRepository.findOne({
      where: { ad: { id: createReviewDto.adId }, user: { id: userId } }
    });

    if (existingReview) {
      throw new ForbiddenException('Vous avez déjà laissé un avis pour cette annonce');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: { id: userId },
      ad: { id: createReviewDto.adId }
    });

    return this.reviewRepository.save(review);
  }

  async findByAd(adId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { ad: { id: adId } },
      order: { createdAt: 'DESC' }
    });
  }

  async getAdRating(adId: string): Promise<{ averageRating: number; totalReviews: number }> {
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
}