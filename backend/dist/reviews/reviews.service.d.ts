import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Ad } from '../ads/entities/ad.entity';
export declare class ReviewsService {
    private reviewRepository;
    private adRepository;
    constructor(reviewRepository: Repository<Review>, adRepository: Repository<Ad>);
    create(createReviewDto: CreateReviewDto, userId: string): Promise<Review>;
    findByAd(adId: string): Promise<Review[]>;
    getAdRating(adId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
}
