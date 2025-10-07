import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialService } from './social.service';
import { SharePlatform } from './entities/social-share.entity';
import { InteractionType } from './entities/user-interaction.entity';

@ApiTags('Social')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enregistrer un partage' })
  async trackShare(
    @Request() req,
    @Body('adId') adId: string,
    @Body('platform') platform: SharePlatform
  ) {
    await this.socialService.trackShare(req.user.id, adId, platform);
    return { success: true };
  }

  @Post('interaction')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enregistrer une interaction' })
  async trackInteraction(
    @Request() req,
    @Body('adId') adId: string,
    @Body('type') type: InteractionType,
    @Body('metadata') metadata?: any
  ) {
    await this.socialService.trackInteraction(req.user.id, adId, type, metadata);
    return { success: true };
  }

  @Get('share-stats/:adId')
  @ApiOperation({ summary: 'Statistiques de partage d\'une annonce' })
  async getShareStats(@Param('adId') adId: string) {
    return this.socialService.getShareStats(adId);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Recommandations personnalisées' })
  async getRecommendations(
    @Request() req,
    @Query('limit') limit = 10
  ) {
    return this.socialService.getRecommendations(req.user.id, Number(limit));
  }
}