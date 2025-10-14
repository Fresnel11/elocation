import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { Ad } from '../ads/entities/ad.entity';
export declare class RecommendationsService {
    private userPreferenceRepository;
    private adRepository;
    constructor(userPreferenceRepository: Repository<UserPreference>, adRepository: Repository<Ad>);
    trackUserAction(userId: string, type: string, data: any): Promise<void>;
    getRecommendedAds(userId: string, limit?: number): Promise<Ad[]>;
    private getUserPreferences;
    private calculateAdScores;
    private getPopularAds;
    private getActionWeight;
}
