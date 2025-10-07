import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
  ) {}

  async getUserFavorites(userId: string) {
    return this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['ad', 'ad.user', 'ad.category'],
      order: { createdAt: 'DESC' }
    });
  }

  async addToFavorites(userId: string, adId: string) {
    const existing = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, ad: { id: adId } }
    });

    if (existing) {
      throw new Error('Annonce déjà dans les favoris');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const ad = await this.adRepository.findOne({ where: { id: adId } });

    if (!user || !ad) {
      throw new Error('Utilisateur ou annonce introuvable');
    }

    const favorite = this.favoriteRepository.create({ user, ad });
    return this.favoriteRepository.save(favorite);
  }

  async removeFromFavorites(userId: string, adId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, ad: { id: adId } }
    });

    if (!favorite) {
      throw new Error('Favori introuvable');
    }

    await this.favoriteRepository.remove(favorite);
    return { message: 'Supprimé des favoris' };
  }

  async isFavorite(userId: string, adId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, ad: { id: adId } }
    });

    return { isFavorite: !!favorite };
  }
}