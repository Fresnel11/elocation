import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { Ad } from './entities/ad.entity';
import { PriceAlertsModule } from '../price-alerts/price-alerts.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CacheModule } from '../cache/cache.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { ABTestingModule } from '../ab-testing/ab-testing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad]), 
    PriceAlertsModule,
    forwardRef(() => NotificationsModule),
    CacheModule,
    forwardRef(() => RecommendationsModule),
    forwardRef(() => ABTestingModule)
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}