import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, req: any): Promise<import("./entities/review.entity").Review>;
    findByAd(adId: string): Promise<import("./entities/review.entity").Review[]>;
    getAdRating(adId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
}
