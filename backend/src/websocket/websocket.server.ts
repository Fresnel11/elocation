import { Injectable } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { JwtService } from '@nestjs/jwt';
import * as url from 'url';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class WebSocketServerService {
  private wss: WebSocketServer;
  private clients = new Map<string, any>();
  private jwtService: JwtService;
  private notificationsGateway: NotificationsGateway;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
    this.wss = new WebSocketServer({ port: 3002 });
    
    this.wss.on('connection', (ws, request) => {
      this.handleConnection(ws, request);
    });

    console.log('WebSocket server started on port 3002');
  }

  setNotificationsGateway(notificationsGateway: NotificationsGateway) {
    this.notificationsGateway = notificationsGateway;
  }

  private handleConnection(ws: any, request: any) {
    try {
      const query = url.parse(request.url, true).query;
      const token = query.token as string;
      
      if (!token) {
        ws.close();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = payload.sub;
      
      this.clients.set(userId, ws);
      console.log(`User ${userId} connected via WebSocket`);
      

      
      // Confirmer la connexion
      ws.send(JSON.stringify({ type: 'connected', data: { userId, message: 'Successfully connected' } }));
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(userId, message, ws);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
      
      ws.on('close', () => {
        this.clients.delete(userId);

        console.log(`User ${userId} disconnected`);
      });
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close();
    }
  }

  private handleMessage(userId: string, message: any, ws: any) {
    // Gérer les messages reçus
    switch (message.type) {
      case 'test_notification':
        if (this.notificationsGateway) {
          this.notificationsGateway.sendNotificationToUser(userId, {
            type: 'test',
            title: 'Test WebSocket',
            message: 'WebSocket fonctionne correctement !',
            timestamp: new Date()
          });
          ws.send(JSON.stringify({ type: 'test_response', data: { success: true, message: 'Notification envoyée' } }));
        }
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  sendToUser(userId: string, data: any) {
    const client = this.clients.get(userId);
    if (client && client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  }

  broadcast(data: any) {
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }

  emitNewMessage(message: any) {
    this.sendToUser(message.senderId, { type: 'new_message', data: message });
    this.sendToUser(message.receiverId, { type: 'new_message', data: message });
  }

  emitUnreadCountUpdate(userId: string, unreadCount: number) {
    this.sendToUser(userId, { type: 'unread_count_update', data: { unreadCount } });
  }
}