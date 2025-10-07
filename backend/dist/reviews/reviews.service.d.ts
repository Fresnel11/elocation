import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Ad } from '../ads/entities/ad.entity';
import { User } from '../users/entities/user.entity';
export declare class ReviewsService {
    private reviewRepository;
    private adRepository;
    private userRepository;
    constructor(reviewRepository: Repository<Review>, adRepository: Repository<Ad>, userRepository: Repository<User>);
    create(createReviewDto: CreateReviewDto, userId: string): Promise<Review>;
    findByAd(adId: string): Promise<Review[]>;
    getAdRating(adId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
    getPendingReviews(): Promise<Review[]>;
    approveReview(id: string): Promise<Review>;
    rejectReview(id: string): Promise<Review>;
    getUserReviews(userId: string): Promise<Review[]>;
}
