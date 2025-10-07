import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { PriceAlertsService } from './price-alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('price-alerts')
@UseGuards(JwtAuthGuard)
export class PriceAlertsController {
  constructor(private readonly priceAlertsService: PriceAlertsService) {}

  @Get()
  async getUserPriceAlerts(@Request() req) {
    return this.priceAlertsService.getUserPriceAlerts(req.user.userId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.priceAlertsService.markAsRead(id);
  }
}