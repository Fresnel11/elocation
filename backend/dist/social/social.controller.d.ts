import { SocialService } from './social.service';
import { SharePlatform } from './entities/social-share.entity';
import { InteractionType } from './entities/user-interaction.entity';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    trackShare(req: any, adId: string, platform: SharePlatform): Promise<{
        success: boolean;
    }>;
    trackInteraction(req: any, adId: string, type: InteractionType, metadata?: any): Promise<{
        success: boolean;
    }>;
    getShareStats(adId: string): Promise<{
        total: number;
        byPlatform: Record<string, number>;
    }>;
    getRecommendations(req: any, limit?: number): Promise<import("../ads/entities/ad.entity").Ad[]>;
}
