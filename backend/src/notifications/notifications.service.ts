import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { SearchAlert } from './entities/search-alert.entity';
import { User } from '../users/entities/user.entity';
import { EmailService } from './services/email.service';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateSearchAlertDto } from './dto/create-search-alert.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private preferenceRepository: Repository<NotificationPreference>,
    @InjectRepository(SearchAlert)
    private searchAlertRepository: Repository<SearchAlert>,
    private emailService: EmailService,

  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const { userId, type, title, message, data } = createNotificationDto;
    
    const notification = this.notificationRepository.create({
      user: { id: userId } as User,
      type,
      title,
      message,
      data,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    
    // Vérifier les préférences utilisateur avant d'envoyer
    const preferences = await this.getNotificationPreferences(userId);
    const typePreference = preferences.find(p => p.type === type as any);
    
    // Envoyer la notification en temps réel si activée
    if (!typePreference || typePreference.pushEnabled) {
      this.sendWebSocketNotification(userId, savedNotification);
    }

    // Envoyer email si activé
    if (!typePreference || typePreference.emailEnabled) {
      // TODO: Implémenter l'envoi d'email selon le type
    }

    return savedNotification;
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ): Promise<Notification> {
    return this.create({ userId, type, title, message, data });
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, user: { id: userId } },
      { read: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: userId }, read: false },
      { read: true }
    );
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const result = await this.notificationRepository.delete({
      id: notificationId,
      user: { id: userId }
    });
    
    if (result.affected === 0) {
      throw new NotFoundException('Notification non trouvée');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { user: { id: userId }, read: false },
    });
  }

  // Méthodes spécifiques pour les réservations
  async notifyBookingRequest(ownerId: string, bookingData: any) {
    return this.createNotification(
      ownerId,
      NotificationType.BOOKING_REQUEST,
      'Nouvelle demande de réservation',
      `${bookingData.tenantName} souhaite réserver "${bookingData.adTitle}"`,
      { bookingId: bookingData.bookingId, adId: bookingData.adId }
    );
  }

  async notifyBookingConfirmed(tenantId: string, bookingData: any) {
    // Envoyer la notification en temps réel
    const notification = await this.createNotification(
      tenantId,
      NotificationType.BOOKING_CONFIRMED,
      'Réservation acceptée !',
      `Votre demande pour "${bookingData.adTitle}" a été acceptée. ${bookingData.paymentLink ? 'Cliquez pour payer.' : ''}`,
      { 
        bookingId: bookingData.bookingId, 
        adId: bookingData.adId,
        paymentRequired: true,
        paymentLink: bookingData.paymentLink
      }
    );

    // Envoyer un email de confirmation avec le lien de paiement
    if (bookingData.userEmail && bookingData.userName && bookingData.paymentLink) {
      const emailBookingData = {
        ad: { title: bookingData.adTitle },
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalAmount: bookingData.totalAmount,
        securityDeposit: bookingData.securityDeposit
      };
      await this.emailService.sendBookingConfirmationEmail(
        bookingData.userEmail,
        bookingData.userName,
        emailBookingData,
        bookingData.paymentLink
      );
    }

    return notification;
  }

  async notifyBookingCancelled(userId: string, bookingData: any, reason?: string) {
    return this.createNotification(
      userId,
      NotificationType.BOOKING_CANCELLED,
      'Réservation annulée',
      `La réservation pour "${bookingData.adTitle}" a été annulée${reason ? `: ${reason}` : ''}`,
      { bookingId: bookingData.bookingId, adId: bookingData.adId, reason }
    );
  }

  async createSearchAlert(userId: string, createSearchAlertDto: CreateSearchAlertDto): Promise<SearchAlert> {
    const alert = this.searchAlertRepository.create({ 
      ...createSearchAlertDto, 
      userId,
      isActive: true 
    });
    return this.searchAlertRepository.save(alert);
  }

  async getUserSearchAlerts(userId: string): Promise<SearchAlert[]> {
    return this.searchAlertRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async updateSearchAlert(id: string, userId: string, updateData: any): Promise<SearchAlert> {
    const alert = await this.searchAlertRepository.findOne({ where: { id, userId } });
    if (!alert) {
      throw new NotFoundException('Search alert not found');
    }
    Object.assign(alert, updateData);
    return this.searchAlertRepository.save(alert);
  }

  async deleteSearchAlert(id: string, userId: string): Promise<void> {
    const result = await this.searchAlertRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Search alert not found');
    }
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreference[]> {
    return this.preferenceRepository.find({ where: { userId } });
  }

  async updateNotificationPreference(userId: string, updateDto: UpdateNotificationPreferenceDto): Promise<NotificationPreference> {
    const { type, emailEnabled, pushEnabled } = updateDto;
    let preference = await this.preferenceRepository.findOne({ where: { userId, type } });
    
    if (!preference) {
      preference = this.preferenceRepository.create({ userId, type, emailEnabled, pushEnabled });
    } else {
      preference.emailEnabled = emailEnabled;
      preference.pushEnabled = pushEnabled;
    }
    
    return this.preferenceRepository.save(preference);
  }

  // Méthode de compatibilité
  async updateNotificationPreferenceLegacy(userId: string, type: string, emailEnabled: boolean, pushEnabled: boolean): Promise<NotificationPreference> {
    return this.updateNotificationPreference(userId, { type: type as any, emailEnabled, pushEnabled });
  }

  private sendWebSocketNotification(userId: string, notification: Notification) {
    try {
      const wsServer = (global as any).wsServer;
      if (wsServer && wsServer.clients) {
        const client = wsServer.clients.get(userId);
        if (client && client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: 'notification',
            data: {
              id: notification.id,
              type: notification.type,
              title: notification.title,
              message: notification.message,
              data: notification.data,
              createdAt: notification.createdAt,
              read: false
            }
          }));
          console.log(`[NotificationsService] Sent WebSocket notification to user ${userId}`);
        } else {
          console.log(`[NotificationsService] User ${userId} not connected to WebSocket`);
        }
      }
    } catch (error) {
      console.error('[NotificationsService] WebSocket send error:', error);
    }
  }
}