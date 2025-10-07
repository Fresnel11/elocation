import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { SocialShare } from './entities/social-share.entity';
import { UserInteraction } from './entities/user-interaction.entity';
import { Ad } from '../ads/entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialShare, UserInteraction, Ad])],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}