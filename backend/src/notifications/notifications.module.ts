import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { SearchAlert } from './entities/search-alert.entity';
import { PushSubscription } from './entities/push-subscription.entity';
import { EmailService } from './services/email.service';
import { PushNotificationService } from './services/push-notification.service';
import { NotificationSchedulerService } from './services/notification-scheduler.service';
import { NotificationCronService } from './services/notification-cron.service';
import { Ad } from '../ads/entities/ad.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationPreference, SearchAlert, PushSubscription, Ad, Booking]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway, EmailService, PushNotificationService, NotificationSchedulerService, NotificationCronService],
  exports: [NotificationsService, PushNotificationService],
})
export class NotificationsModule {}