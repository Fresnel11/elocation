import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Ad } from '../ads/entities/ad.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user: { id: userId } as User,
      ad: { id: createReviewDto.adId } as Ad
    });

    return this.reviewRepository.save(review);
  }

  async findByAd(adId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { ad: { id: adId } },
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
      },
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