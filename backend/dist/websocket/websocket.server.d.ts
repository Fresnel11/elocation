import { JwtService } from '@nestjs/jwt';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class WebSocketServerService {
    private wss;
    private clients;
    private jwtService;
    private notificationsGateway;
    constructor(jwtService: JwtService);
    setNotificationsGateway(notificationsGateway: NotificationsGateway): void;
    private handleConnection;
    private handleMessage;
    sendToUser(userId: string, data: any): void;
    broadcast(data: any): void;
    emitNewMessage(message: any): void;
    emitUnreadCountUpdate(userId: string, unreadCount: number): void;
}
