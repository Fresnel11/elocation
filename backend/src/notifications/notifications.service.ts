import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { id: userId } as User,
      type,
      title,
      message,
      data,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    
    // Envoyer la notification en temps réel
    this.notificationsGateway.sendNotificationToUser(userId, {
      id: savedNotification.id,
      type: savedNotification.type,
      title: savedNotification.title,
      message: savedNotification.message,
      data: savedNotification.data,
      createdAt: savedNotification.createdAt,
    });

    return savedNotification;
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
}