import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as WebSocket from 'ws';
import * as url from 'url';

@Injectable()
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name);
  private clients = new Map<string, WebSocket>();

  constructor(private jwtService: JwtService) {}

  addClient(userId: string, ws: WebSocket) {
    this.clients.set(userId, ws);
    this.logger.log(`User ${userId} connected to notifications`);
  }

  removeClient(userId: string) {
    this.clients.delete(userId);
    this.logger.log(`User ${userId} disconnected from notifications`);
  }

  sendToUser(userId: string, data: any) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

  broadcast(data: any) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Méthode pour envoyer une notification à un utilisateur spécifique
  sendNotificationToUser(userId: string, notification: any) {
    this.sendToUser(userId, { type: 'notification', data: notification });
  }

  // Méthode pour envoyer une notification à tous les utilisateurs connectés
  sendBroadcastNotification(notification: any) {
    this.broadcast({ type: 'broadcast_notification', data: notification });
  }

  // Méthode pour notifier les admins d'une nouvelle vérification
  notifyAdminsNewVerification(verification: any) {
    this.broadcast({ type: 'new_verification', data: verification });
  }

  // Méthode pour notifier un utilisateur du statut de sa vérification
  notifyVerificationStatus(userId: string, status: string, reason?: string) {
    this.sendNotificationToUser(userId, {
      type: 'verification_status',
      status,
      reason,
      timestamp: new Date()
    });
  }
}