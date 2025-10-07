import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { SearchAlert } from './entities/search-alert.entity';
import { NotificationsGateway } from './notifications.gateway';
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
    private notificationsGateway: NotificationsGateway,
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
      this.notificationsGateway.sendNotificationToUser(userId, {
        id: savedNotification.id,
        type: savedNotification.type,
        title: savedNotification.title,
        message: savedNotification.message,
        data: savedNotification.data,
        createdAt: savedNotification.createdAt,
      });
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
    return this.createNotification(
      tenantId,
      NotificationType.BOOKING_CONFIRMED,
      'Réservation confirmée',
      `Votre demande pour "${bookingData.adTitle}" a été acceptée`,
      { bookingId: bookingData.bookingId, adId: bookingData.adId }
    );
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
}