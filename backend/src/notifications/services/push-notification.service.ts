import { Injectable } from '@nestjs/common';
import * as webpush from 'web-push';

@Injectable()
export class PushNotificationService {
  constructor() {
    // Initialiser seulement si les clés sont présentes
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        'mailto:' + (process.env.VAPID_EMAIL || 'admin@elocation.bj'),
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    }
  }

  async sendPushNotification(
    subscription: any,
    title: string,
    message: string,
    data?: any
  ) {
    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/assets/elocation-512.png',
      badge: '/assets/elocation-512.png',
      data: data || {},
      actions: [
        {
          action: 'view',
          title: 'Voir',
        },
        {
          action: 'close',
          title: 'Fermer',
        }
      ]
    });

    try {
      await webpush.sendNotification(subscription, payload);
    } catch (error) {
      console.error('Erreur envoi notification push:', error);
    }
  }

  async sendBookingRequestPush(subscription: any, adTitle: string, tenantName: string) {
    await this.sendPushNotification(
      subscription,
      'Nouvelle demande de réservation',
      `${tenantName} souhaite réserver "${adTitle}"`,
      { type: 'booking_request' }
    );
  }

  async sendBookingConfirmedPush(subscription: any, adTitle: string) {
    await this.sendPushNotification(
      subscription,
      'Réservation confirmée',
      `Votre demande pour "${adTitle}" a été acceptée`,
      { type: 'booking_confirmed' }
    );
  }

  async sendNewAdMatchPush(subscription: any, alertName: string, adCount: number) {
    await this.sendPushNotification(
      subscription,
      'Nouvelles annonces disponibles',
      `${adCount} nouvelle(s) annonce(s) correspondent à votre alerte "${alertName}"`,
      { type: 'new_ad_match' }
    );
  }
}