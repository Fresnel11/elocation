import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { Referral } from './entities/referral.entity';
import { LoyaltyPoints } from './entities/loyalty-points.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Referral, LoyaltyPoints, User])],
  controllers: [ReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}