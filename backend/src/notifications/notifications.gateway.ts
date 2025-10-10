import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn('No token provided for WebSocket connection');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = payload.sub;
      
      // Stocker les informations utilisateur sur le socket
      client.data.userId = userId;
      client.data.user = payload;
      
      this.userSockets.set(userId, client.id);
      client.join(`user_${userId}`);
      
      this.logger.log(`User ${userId} connected with socket ${client.id}`);
      
      // Confirmer la connexion
      client.emit('connected', { userId, message: 'Successfully connected to notifications' });
    } catch (error) {
      this.logger.error('WebSocket connection error:', error.message);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    } else {
      // Fallback: chercher dans la map
      for (const [uid, socketId] of this.userSockets.entries()) {
        if (socketId === client.id) {
          this.userSockets.delete(uid);
          this.logger.log(`User ${uid} disconnected (fallback)`);
          break;
        }
      }
    }
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    client.join(`user_${data.userId}`);
  }

  // Méthode pour envoyer une notification à un utilisateur spécifique
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }

  // Méthode pour envoyer une notification à tous les utilisateurs connectés
  sendBroadcastNotification(notification: any) {
    this.server.emit('broadcast_notification', notification);
  }

  // Méthode pour notifier les admins d'une nouvelle vérification
  notifyAdminsNewVerification(verification: any) {
    this.server.emit('new_verification', verification);
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

  @SubscribeMessage('test_notification')
  handleTestNotification(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.sendNotificationToUser(userId, {
        type: 'test',
        title: 'Test WebSocket',
        message: 'WebSocket fonctionne correctement !',
        timestamp: new Date()
      });
      client.emit('test_response', { success: true, message: 'Notification envoyée' });
    } else {
      client.emit('test_response', { success: false, message: 'Utilisateur non authentifié' });
    }
  }
}