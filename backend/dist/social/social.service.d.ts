import { Repository } from 'typeorm';
import { SocialShare, SharePlatform } from './entities/social-share.entity';
import { UserInteraction, InteractionType } from './entities/user-interaction.entity';
import { Ad } from '../ads/entities/ad.entity';
export declare class SocialService {
    private socialShareRepository;
    private userInteractionRepository;
    private adRepository;
    constructor(socialShareRepository: Repository<SocialShare>, userInteractionRepository: Repository<UserInteraction>, adRepository: Repository<Ad>);
    trackShare(userId: string, adId: string, platform: SharePlatform): Promise<void>;
    trackInteraction(userId: string, adId: string, type: InteractionType, metadata?: any): Promise<void>;
    getShareStats(adId: string): Promise<{
        total: number;
        byPlatform: Record<string, number>;
    }>;
    getRecommendations(userId: string, limit?: number): Promise<Ad[]>;
    private getPopularAds;
    private analyzeCategoryPreferences;
    private analyzeLocationPreferences;
    private analyzePriceRange;
}
