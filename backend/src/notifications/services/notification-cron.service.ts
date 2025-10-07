import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Between } from 'typeorm';
import { SearchAlert } from '../entities/search-alert.entity';
import { Ad } from '../../ads/entities/ad.entity';
import { Booking, BookingStatus } from '../../bookings/entities/booking.entity';
import { NotificationsService } from '../notifications.service';
import { EmailService } from './email.service';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationCronService {
  constructor(
    @InjectRepository(SearchAlert)
    private searchAlertRepository: Repository<SearchAlert>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  // Vérifier les nouvelles annonces correspondant aux alertes toutes les heures
  @Cron(CronExpression.EVERY_HOUR)
  async checkNewAdMatches() {
    console.log('🔍 Vérification des nouvelles annonces...');
    
    const activeAlerts = await this.searchAlertRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });

    for (const alert of activeAlerts) {
      try {
        const lastCheck = alert.lastNotifiedAt || new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const query = this.adRepository.createQueryBuilder('ad')
          .leftJoinAndSelect('ad.category', 'category')
          .leftJoinAndSelect('ad.user', 'user')
          .where('ad.isActive = :isActive', { isActive: true })
          .andWhere('ad.isAvailable = :isAvailable', { isAvailable: true })
          .andWhere('ad.createdAt > :lastCheck', { lastCheck })
          .andWhere('ad.userId != :userId', { userId: alert.userId }); // Exclure ses propres annonces

        // Appliquer les filtres de l'alerte
        if (alert.location) {
          query.andWhere('ad.location ILIKE :location', { 
            location: `%${alert.location}%` 
          });
        }
        
        if (alert.categoryId) {
          query.andWhere('ad.categoryId = :categoryId', { 
            categoryId: alert.categoryId 
          });
        }
        
        if (alert.minPrice) {
          query.andWhere('ad.price >= :minPrice', { 
            minPrice: alert.minPrice 
          });
        }
        
        if (alert.maxPrice) {
          query.andWhere('ad.price <= :maxPrice', { 
            maxPrice: alert.maxPrice 
          });
        }
        
        if (alert.bedrooms) {
          query.andWhere('ad.bedrooms >= :bedrooms', { 
            bedrooms: alert.bedrooms 
          });
        }
        
        if (alert.bathrooms) {
          query.andWhere('ad.bathrooms >= :bathrooms', { 
            bathrooms: alert.bathrooms 
          });
        }

        const matchingAds = await query.getMany();

        if (matchingAds.length > 0) {
          // Créer notification
          await this.notificationsService.createNotification(
            alert.userId,
            NotificationType.NEW_AD_MATCH,
            'Nouvelles annonces disponibles',
            `${matchingAds.length} nouvelle(s) annonce(s) correspondent à votre alerte "${alert.name}"`,
            { 
              alertId: alert.id, 
              alertName: alert.name,
              adCount: matchingAds.length,
              ads: matchingAds.slice(0, 3).map(ad => ({
                id: ad.id,
                title: ad.title,
                price: ad.price,
                location: ad.location
              }))
            }
          );

          // Envoyer email
          await this.emailService.sendNewAdMatchEmail(
            alert.user.email,
            alert.user.firstName,
            matchingAds.slice(0, 5) // Limiter à 5 annonces dans l'email
          );

          // Mettre à jour la date de dernière notification
          alert.lastNotifiedAt = new Date();
          await this.searchAlertRepository.save(alert);

          console.log(`✅ ${matchingAds.length} annonce(s) trouvée(s) pour l'alerte "${alert.name}"`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la vérification de l'alerte ${alert.id}:`, error);
      }
    }
  }

  // Envoyer des rappels de réservation tous les jours à 9h
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendBookingReminders() {
    console.log('📅 Envoi des rappels de réservation...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const upcomingBookings = await this.bookingRepository.find({
      where: {
        startDate: Between(tomorrow, dayAfterTomorrow),
        status: BookingStatus.CONFIRMED
      },
      relations: ['tenant', 'ad', 'owner'],
    });

    for (const booking of upcomingBookings) {
      try {
        // Notification pour le locataire
        await this.notificationsService.createNotification(
          booking.tenant.id,
          NotificationType.BOOKING_REMINDER,
          'Rappel de réservation',
          `Votre réservation pour "${booking.ad.title}" commence demain`,
          { 
            bookingId: booking.id,
            adId: booking.ad.id,
            startDate: booking.startDate,
            endDate: booking.endDate
          }
        );

        // Email de rappel
        await this.emailService.sendBookingReminderEmail(
          booking.tenant.email,
          booking.tenant.firstName,
          booking
        );

        console.log(`✅ Rappel envoyé pour la réservation ${booking.id}`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'envoi du rappel pour la réservation ${booking.id}:`, error);
      }
    }
  }

  // Nettoyer les anciennes notifications tous les dimanches à minuit
  @Cron('0 0 * * 0') // Dimanche à minuit
  async cleanupOldNotifications() {
    console.log('🧹 Nettoyage des anciennes notifications...');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const result = await this.notificationsService['notificationRepository']
        .createQueryBuilder()
        .delete()
        .where('createdAt < :date AND read = :read', { 
          date: thirtyDaysAgo, 
          read: true 
        })
        .execute();

      console.log(`✅ ${result.affected} anciennes notifications supprimées`);
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage des notifications:', error);
    }
  }
}