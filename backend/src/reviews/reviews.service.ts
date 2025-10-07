import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './entities/review.entity';
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
      where: { ad: { id: adId }, status: ReviewStatus.APPROVED },
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
      .where('review.adId = :adId AND review.status = :status', { adId, status: ReviewStatus.APPROVED })
      .getRawOne();

    return {
      averageRating: parseFloat(result.averageRating) || 0,
      totalReviews: parseInt(result.totalReviews) || 0
    };
  }

  async getPendingReviews(): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { status: ReviewStatus.PENDING },
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

  async approveReview(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }
    
    review.status = ReviewStatus.APPROVED;
    return this.reviewRepository.save(review);
  }

  async rejectReview(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }
    
    review.status = ReviewStatus.REJECTED;
    return this.reviewRepository.save(review);
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { 
        ad: { user: { id: userId } },
        status: ReviewStatus.APPROVED 
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
}