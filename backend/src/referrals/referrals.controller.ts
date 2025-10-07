import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReferralsService } from './referrals.service';

@ApiTags('Referrals')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('my-code')
  @ApiOperation({ summary: 'Obtenir mon code de parrainage' })
  async getMyReferralCode(@Request() req) {
    const code = await this.referralsService.generateReferralCode(req.user.id);
    return { referralCode: code };
  }

  @Post('use-code')
  @ApiOperation({ summary: 'Utiliser un code de parrainage' })
  async useReferralCode(@Request() req, @Body('code') code: string) {
    const referral = await this.referralsService.useReferralCode(code, req.user.id);
    return { success: true, referral };
  }

  @Get('my-referrals')
  @ApiOperation({ summary: 'Mes parrainages' })
  async getMyReferrals(@Request() req) {
    return this.referralsService.getUserReferrals(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques de parrainage' })
  async getReferralStats(@Request() req) {
    return this.referralsService.getReferralStats(req.user.id);
  }

  @Get('loyalty-points')
  @ApiOperation({ summary: 'Points de fidélité' })
  async getLoyaltyPoints(@Request() req) {
    return this.referralsService.getUserLoyaltyPoints(req.user.id);
  }
}