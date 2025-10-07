import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SocialShare, SharePlatform } from './entities/social-share.entity';
import { UserInteraction, InteractionType } from './entities/user-interaction.entity';
import { Ad } from '../ads/entities/ad.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialShare)
    private socialShareRepository: Repository<SocialShare>,
    @InjectRepository(UserInteraction)
    private userInteractionRepository: Repository<UserInteraction>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
  ) {}

  async trackShare(userId: string, adId: string, platform: SharePlatform): Promise<void> {
    const share = this.socialShareRepository.create({
      userId,
      adId,
      platform,
    });
    await this.socialShareRepository.save(share);
    
    // Enregistrer aussi comme interaction
    await this.trackInteraction(userId, adId, InteractionType.SHARE);
  }

  async trackInteraction(userId: string, adId: string, type: InteractionType, metadata?: any): Promise<void> {
    const interaction = this.userInteractionRepository.create({
      userId,
      adId,
      type,
      metadata,
    });
    await this.userInteractionRepository.save(interaction);
  }

  async getShareStats(adId: string): Promise<{ total: number; byPlatform: Record<string, number> }> {
    const shares = await this.socialShareRepository.find({ where: { adId } });
    
    const byPlatform = shares.reduce((acc, share) => {
      acc[share.platform] = (acc[share.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: shares.length,
      byPlatform,
    };
  }

  async getRecommendations(userId: string, limit = 10): Promise<Ad[]> {
    // Récupérer les interactions de l'utilisateur
    const userInteractions = await this.userInteractionRepository.find({
      where: { userId },
      relations: ['ad', 'ad.category'],
      order: { createdAt: 'DESC' },
      take: 50,
    });

    if (userInteractions.length === 0) {
      // Utilisateur sans historique : recommander les annonces populaires
      return this.getPopularAds(limit);
    }

    // Analyser les préférences utilisateur
    const categoryPreferences = this.analyzeCategoryPreferences(userInteractions);
    const locationPreferences = this.analyzeLocationPreferences(userInteractions);
    const priceRange = this.analyzePriceRange(userInteractions);

    // Construire la requête de recommandation
    const queryBuilder = this.adRepository.createQueryBuilder('ad')
      .leftJoinAndSelect('ad.category', 'category')
      .leftJoinAndSelect('ad.user', 'user')
      .where('ad.isActive = :isActive', { isActive: true })
      .andWhere('ad.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('ad.userId != :userId', { userId }); // Exclure ses propres annonces

    // Appliquer les filtres de préférence
    if (categoryPreferences.length > 0) {
      queryBuilder.andWhere('ad.categoryId IN (:...categories)', { categories: categoryPreferences });
    }

    if (locationPreferences.length > 0) {
      const locationConditions = locationPreferences.map((loc, index) => 
        `ad.location ILIKE :location${index}`
      ).join(' OR ');
      queryBuilder.andWhere(`(${locationConditions})`);
      
      locationPreferences.forEach((loc, index) => {
        queryBuilder.setParameter(`location${index}`, `%${loc}%`);
      });
    }

    if (priceRange.min && priceRange.max) {
      queryBuilder.andWhere('ad.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      });
    }

    return queryBuilder
      .orderBy('ad.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  private async getPopularAds(limit: number): Promise<Ad[]> {
    // Annonces avec le plus d'interactions récentes
    const popularAdIds = await this.userInteractionRepository
      .createQueryBuilder('interaction')
      .select('interaction.adId', 'adId')
      .addSelect('COUNT(*)', 'interactionCount')
      .where('interaction.createdAt > :date', { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) })
      .groupBy('interaction.adId')
      .orderBy('interactionCount', 'DESC')
      .limit(limit)
      .getRawMany();

    if (popularAdIds.length === 0) {
      return this.adRepository.find({
        where: { isActive: true, isAvailable: true },
        relations: ['category', 'user'],
        order: { createdAt: 'DESC' },
        take: limit,
      });
    }

    const adIds = popularAdIds.map(item => item.adId);
    return this.adRepository.find({
      where: { id: In(adIds) },
      relations: ['category', 'user'],
    });
  }

  private analyzeCategoryPreferences(interactions: UserInteraction[]): string[] {
    const categoryCount = interactions.reduce((acc, interaction) => {
      const categoryId = interaction.ad?.categoryId;
      if (categoryId) {
        acc[categoryId] = (acc[categoryId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([categoryId]) => categoryId);
  }

  private analyzeLocationPreferences(interactions: UserInteraction[]): string[] {
    const locationCount = interactions.reduce((acc, interaction) => {
      const location = interaction.ad?.location;
      if (location) {
        // Extraire la ville principale
        const city = location.split(',')[0].trim();
        acc[city] = (acc[city] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([location]) => location);
  }

  private analyzePriceRange(interactions: UserInteraction[]): { min?: number; max?: number } {
    const prices = interactions
      .map(interaction => interaction.ad?.price)
      .filter(price => price != null)
      .map(price => Number(price));

    if (prices.length === 0) return {};

    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const margin = avgPrice * 0.3; // ±30% de la moyenne

    return {
      min: Math.max(0, avgPrice - margin),
      max: avgPrice + margin,
    };
  }
}