import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAnalytics } from '../entities/user-analytics.entity';
import { Ad } from '../../ads/entities/ad.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UserAnalytics)
    private analyticsRepository: Repository<UserAnalytics>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async getUserStats(userId: string) {
    const [ads, bookings, analytics] = await Promise.all([
      this.adRepository.find({ where: { userId } }),
      this.bookingRepository.find({ where: { ad: { userId } }, relations: ['ad'] }),
      this.getOrCreateAnalytics(userId)
    ]);

    const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
    const activeAds = ads.filter(ad => ad.isActive && ad.isAvailable).length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    const occupancyRate = this.calculateOccupancyRate(bookings, ads);

    return {
      totalAds: ads.length,
      activeAds,
      totalViews,
      totalBookings: bookings.length,
      totalRevenue,
      occupancyRate,
      monthlyStats: await this.getMonthlyStats(userId),
      topPerformingAds: await this.getTopPerformingAds(userId)
    };
  }

  private async getOrCreateAnalytics(userId: string): Promise<UserAnalytics> {
    let analytics = await this.analyticsRepository.findOne({ where: { userId } });
    
    if (!analytics) {
      analytics = this.analyticsRepository.create({ userId });
      await this.analyticsRepository.save(analytics);
    }
    
    return analytics;
  }

  private calculateOccupancyRate(bookings: any[], ads: any[]): number {
    if (ads.length === 0) return 0;
    
    const totalDays = ads.length * 30; // Approximation sur 30 jours
    const bookedDays = bookings.reduce((sum, booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    
    return totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;
  }

  private async getMonthlyStats(userId: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.ad', 'ad')
      .where('ad.userId = :userId', { userId })
      .andWhere('booking.createdAt >= :date', { date: sixMonthsAgo })
      .getMany();

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getFullYear() === date.getFullYear() && 
               bookingDate.getMonth() === date.getMonth();
      });

      monthlyData.push({
        month: monthKey,
        bookings: monthBookings.length,
        revenue: monthBookings.reduce((sum, b) => sum + b.totalPrice, 0)
      });
    }

    return monthlyData;
  }

  private async getTopPerformingAds(userId: string) {
    return this.adRepository
      .createQueryBuilder('ad')
      .where('ad.userId = :userId', { userId })
      .orderBy('ad.views', 'DESC')
      .limit(5)
      .getMany();
  }
}