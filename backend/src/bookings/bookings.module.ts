import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsCronService } from './bookings.cron';
import { Booking } from './entities/booking.entity';
import { AdsModule } from '../ads/ads.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    AdsModule,
    NotificationsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsCronService],
  exports: [BookingsService],
})
export class BookingsModule {}