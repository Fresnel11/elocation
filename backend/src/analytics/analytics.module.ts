import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { UserAnalytics } from './entities/user-analytics.entity';
import { Ad } from '../ads/entities/ad.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAnalytics, Ad, Booking])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}