import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { UserPreference } from './entities/user-preference.entity';
import { Ad } from '../ads/entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreference, Ad])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}