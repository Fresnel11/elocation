import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { PushNotificationService } from './services/push-notification.service';
import { CreateSearchAlertDto } from './dto/create-search-alert.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly pushNotificationService: PushNotificationService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer les notifications de l\'utilisateur' })
  async getNotifications(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.notificationsService.getUserNotifications(req.user.id, page, limit);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Nombre de notifications non lues' })
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    await this.notificationsService.markAsRead(id, req.user.id);
    return { success: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une notification' })
  async deleteNotification(@Param('id') id: string, @Request() req) {
    await this.notificationsService.deleteNotification(id, req.user.id);
    return { success: true };
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { success: true };
  }

  @Post('search-alerts')
  @ApiOperation({ summary: 'Créer une alerte de recherche' })
  async createSearchAlert(@Request() req, @Body() createSearchAlertDto: CreateSearchAlertDto) {
    return this.notificationsService.createSearchAlert(req.user.id, createSearchAlertDto);
  }

  @Get('search-alerts')
  @ApiOperation({ summary: 'Récupérer les alertes de recherche' })
  async getUserSearchAlerts(@Request() req) {
    return this.notificationsService.getUserSearchAlerts(req.user.id);
  }

  @Patch('search-alerts/:id')
  @ApiOperation({ summary: 'Modifier une alerte de recherche' })
  async updateSearchAlert(@Request() req, @Param('id') id: string, @Body() updateData: any) {
    return this.notificationsService.updateSearchAlert(id, req.user.id, updateData);
  }

  @Delete('search-alerts/:id')
  @ApiOperation({ summary: 'Supprimer une alerte de recherche' })
  async deleteSearchAlert(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteSearchAlert(id, req.user.id);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Récupérer les préférences de notifications' })
  async getNotificationPreferences(@Request() req) {
    return this.notificationsService.getNotificationPreferences(req.user.id);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Modifier les préférences de notifications' })
  async updateNotificationPreference(
    @Request() req,
    @Body() updateDto: UpdateNotificationPreferenceDto
  ) {
    return this.notificationsService.updateNotificationPreference(req.user.id, updateDto);
  }

  @Post('push-subscription')
  @ApiOperation({ summary: 'S\'abonner aux notifications push' })
  async subscribeToPush(
    @Request() req,
    @Body() subscriptionData: { endpoint: string; keys: any }
  ) {
    // TODO: Implémenter la sauvegarde de l'abonnement push
    return { success: true };
  }

  @Delete('push-subscription')
  @ApiOperation({ summary: 'Se désabonner des notifications push' })
  async unsubscribeFromPush(@Request() req) {
    // TODO: Implémenter la suppression de l'abonnement push
    return { success: true };
  }
}