import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { SearchAlert } from '../entities/search-alert.entity';
import { Ad } from '../../ads/entities/ad.entity';
import { Booking, BookingStatus } from '../../bookings/entities/booking.entity';
import { EmailService } from './email.service';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class NotificationSchedulerService {
  constructor(
    @InjectRepository(SearchAlert)
    private searchAlertRepository: Repository<SearchAlert>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkNewAdMatches() {
    const alerts = await this.searchAlertRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });

    for (const alert of alerts) {
      const query = this.adRepository.createQueryBuilder('ad')
        .leftJoinAndSelect('ad.category', 'category')
        .where('ad.isActive = :isActive', { isActive: true })
        .andWhere('ad.createdAt > :lastNotified', { 
          lastNotified: alert.lastNotifiedAt || new Date(Date.now() - 24 * 60 * 60 * 1000) 
        });

      if (alert.location) {
        query.andWhere('ad.location ILIKE :location', { location: `%${alert.location}%` });
      }
      if (alert.categoryId) {
        query.andWhere('ad.categoryId = :categoryId', { categoryId: alert.categoryId });
      }
      if (alert.minPrice) {
        query.andWhere('ad.price >= :minPrice', { minPrice: alert.minPrice });
      }
      if (alert.maxPrice) {
        query.andWhere('ad.price <= :maxPrice', { maxPrice: alert.maxPrice });
      }
      if (alert.bedrooms) {
        query.andWhere('ad.bedrooms >= :bedrooms', { bedrooms: alert.bedrooms });
      }
      if (alert.bathrooms) {
        query.andWhere('ad.bathrooms >= :bathrooms', { bathrooms: alert.bathrooms });
      }

      const matchingAds = await query.getMany();

      if (matchingAds.length > 0) {
        await this.emailService.sendNewAdMatchEmail(
          alert.user.email,
          alert.user.firstName,
          matchingAds
        );

        await this.notificationsService.createNotification(
          alert.userId,
          'NEW_AD_MATCH' as any,
          'Nouvelles annonces disponibles',
          `${matchingAds.length} nouvelle(s) annonce(s) correspondent à votre alerte "${alert.name}"`,
          { alertId: alert.id, adCount: matchingAds.length }
        );

        alert.lastNotifiedAt = new Date();
        await this.searchAlertRepository.save(alert);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendBookingReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const bookings = await this.bookingRepository.find({
      where: {
        startDate: Between(tomorrow, dayAfterTomorrow),
        status: BookingStatus.CONFIRMED
      },
      relations: ['tenant', 'ad'],
    });

    for (const booking of bookings) {
      await this.emailService.sendBookingReminderEmail(
        booking.tenant.email,
        booking.tenant.firstName,
        booking
      );

      await this.notificationsService.createNotification(
        booking.tenant.id,
        'BOOKING_REMINDER' as any,
        'Rappel de réservation',
        `Votre réservation pour "${booking.ad.title}" commence demain`,
        { bookingId: booking.id }
      );
    }
  }
}