import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceAlert } from './entities/price-alert.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class PriceAlertsService {
  constructor(
    @InjectRepository(PriceAlert)
    private priceAlertRepository: Repository<PriceAlert>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private notificationsService: NotificationsService,
  ) {}

  async checkPriceChanges(adId: string, newPrice: number, previousPrice: number) {
    if (newPrice === previousPrice) return;

    const favorites = await this.favoriteRepository.find({
      where: { ad: { id: adId } },
      relations: ['user', 'ad']
    });

    for (const favorite of favorites) {
      await this.createPriceAlert(favorite.user.id, adId, previousPrice, newPrice);
      
      const priceChange = newPrice > previousPrice ? 'augmenté' : 'baissé';
      const changeAmount = Math.abs(newPrice - previousPrice);
      
      await this.notificationsService.createNotification(
        favorite.user.id,
        NotificationType.PRICE_CHANGE,
        `Prix ${priceChange}`,
        `Le prix de "${favorite.ad.title}" a ${priceChange} de ${changeAmount.toLocaleString()} FCFA`,
        { adId, previousPrice, newPrice }
      );
    }
  }

  private async createPriceAlert(userId: string, adId: string, previousPrice: number, newPrice: number) {
    const alert = this.priceAlertRepository.create({
      user: { id: userId },
      ad: { id: adId },
      previousPrice,
      newPrice
    });
    
    return this.priceAlertRepository.save(alert);
  }

  async getUserPriceAlerts(userId: string) {
    return this.priceAlertRepository.find({
      where: { user: { id: userId } },
      relations: ['ad'],
      order: { createdAt: 'DESC' }
    });
  }

  async markAsRead(alertId: string) {
    await this.priceAlertRepository.update(alertId, { isRead: true });
  }
}