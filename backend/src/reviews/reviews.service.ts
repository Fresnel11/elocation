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

    // Vérifier le nombre d'avis existants de cet utilisateur pour cette annonce
    const existingReviewsCount = await this.reviewRepository.count({
      where: {
        ad: { id: createReviewDto.adId },
        user: { id: userId }
      }
    });

    if (existingReviewsCount >= 2) {
      throw new ForbiddenException('Vous ne pouvez pas ajouter plus de 2 avis par annonce');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user: user,
      ad: { id: createReviewDto.adId } as Ad
    });

    const savedReview = await this.reviewRepository.save(review);
    
    // Return with user relation loaded
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

  async findByAd(adId: string): Promise<Review[]> {
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