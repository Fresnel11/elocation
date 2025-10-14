import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { Ad } from '../ads/entities/ad.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(UserPreference)
    private userPreferenceRepository: Repository<UserPreference>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
  ) {}

  async trackUserAction(userId: string, type: string, data: any): Promise<void> {
    const preference = this.userPreferenceRepository.create({
      userId,
      type,
      data,
      weight: this.getActionWeight(type)
    });
    await this.userPreferenceRepository.save(preference);
  }

  async getRecommendedAds(userId: string, limit: number = 10): Promise<Ad[]> {
    const preferences = await this.getUserPreferences(userId);
    if (preferences.length === 0) {
      return this.getPopularAds(limit);
    }

    const scores = await this.calculateAdScores(preferences);
    const topAdIds = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);

    if (topAdIds.length === 0) {
      return this.getPopularAds(limit);
    }

    return this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .leftJoinAndSelect('ad.category', 'category')
      .where('ad.id IN (:...ids)', { ids: topAdIds })
      .andWhere('ad.isActive = true')
      .andWhere('ad.isAvailable = true')
      .getMany();
  }

  private async getUserPreferences(userId: string): Promise<UserPreference[]> {
    return this.userPreferenceRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 100
    });
  }

  private async calculateAdScores(preferences: UserPreference[]): Promise<Record<string, number>> {
    const scores: Record<string, number> = {};
    const categoryWeights: Record<string, number> = {};
    const locationWeights: Record<string, number> = {};

    // Analyser les préférences
    preferences.forEach(pref => {
      if (pref.data.categoryId) {
        categoryWeights[pref.data.categoryId] = (categoryWeights[pref.data.categoryId] || 0) + pref.weight;
      }
      if (pref.data.location) {
        locationWeights[pref.data.location] = (locationWeights[pref.data.location] || 0) + pref.weight;
      }
    });

    // Récupérer les annonces et calculer les scores
    const ads = await this.adRepository.find({
      where: { isActive: true, isAvailable: true },
      relations: ['category']
    });

    ads.forEach(ad => {
      let score = 0;
      
      // Score basé sur la catégorie
      if (categoryWeights[ad.categoryId]) {
        score += categoryWeights[ad.categoryId] * 0.4;
      }
      
      // Score basé sur la localisation
      const locationMatch = Object.keys(locationWeights).find(loc => 
        ad.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (locationMatch) {
        score += locationWeights[locationMatch] * 0.3;
      }
      
      // Score basé sur la fraîcheur
      const daysSinceCreated = (Date.now() - new Date(ad.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, (30 - daysSinceCreated) / 30) * 0.3;
      
      scores[ad.id] = score;
    });

    return scores;
  }

  private async getPopularAds(limit: number): Promise<Ad[]> {
    return this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .leftJoinAndSelect('ad.category', 'category')
      .where('ad.isActive = true')
      .andWhere('ad.isAvailable = true')
      .orderBy('ad.views', 'DESC')
      .addOrderBy('ad.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  private getActionWeight(type: string): number {
    const weights = {
      'view': 1,
      'favorite': 3,
      'contact': 5,
      'search': 2
    };
    return weights[type] || 1;
  }
}