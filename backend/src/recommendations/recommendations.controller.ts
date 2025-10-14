import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommandations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async getRecommendations(@Request() req, @Query('limit') limit: number = 10) {
    return this.recommendationsService.getRecommendedAds(req.user.id, limit);
  }

  @Post('track')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async trackAction(@Request() req, @Body() body: { type: string; data: any }) {
    await this.recommendationsService.trackUserAction(req.user.id, body.type, body.data);
    return { success: true };
  }
}