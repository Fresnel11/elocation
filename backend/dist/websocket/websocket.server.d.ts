import { JwtService } from '@nestjs/jwt';
export declare class WebSocketServerService {
    private static instance;
    private wss;
    private clients;
    private jwtService;
    private isInitialized;
    constructor(jwtService: JwtService);
    private initializeServer;
    private handleConnection;
    private handleMessage;
    sendToUser(userId: string, data: any): void;
    broadcast(data: any): void;
    emitNewMessage(message: any): void;
    emitUnreadCountUpdate(userId: string, unreadCount: number): void;
    sendNotificationToUser(userId: string, notification: any): void;
}
