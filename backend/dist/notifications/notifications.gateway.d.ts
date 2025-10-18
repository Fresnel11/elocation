import { JwtService } from '@nestjs/jwt';
import * as WebSocket from 'ws';
export declare class NotificationsGateway {
    private jwtService;
    private readonly logger;
    private clients;
    constructor(jwtService: JwtService);
    addClient(userId: string, ws: WebSocket): void;
    removeClient(userId: string): void;
    sendToUser(userId: string, data: any): void;
    broadcast(data: any): void;
    sendNotificationToUser(userId: string, notification: any): void;
    sendBroadcastNotification(notification: any): void;
    notifyAdminsNewVerification(verification: any): void;
    notifyVerificationStatus(userId: string, status: string, reason?: string): void;
}
