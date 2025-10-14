import { RecommendationsService } from './recommendations.service';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    getRecommendations(req: any, limit?: number): Promise<import("../ads/entities/ad.entity").Ad[]>;
    trackAction(req: any, body: {
        type: string;
        data: any;
    }): Promise<{
        success: boolean;
    }>;
}
