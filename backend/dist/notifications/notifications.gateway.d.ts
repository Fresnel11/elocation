import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private readonly logger;
    private userSockets;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(data: {
        userId: string;
    }, client: Socket): void;
    sendNotificationToUser(userId: string, notification: any): void;
    sendBroadcastNotification(notification: any): void;
    notifyAdminsNewVerification(verification: any): void;
    notifyVerificationStatus(userId: string, status: string, reason?: string): void;
    handleTestNotification(data: any, client: Socket): void;
}
