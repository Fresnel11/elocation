import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketServerService } from './websocket/websocket.server';
import { MessagesService } from './messages/messages.service';
import { NotificationsGateway } from './notifications/notifications.gateway';
export declare class AppModule implements OnModuleInit {
    private jwtService;
    private messagesService;
    private webSocketServerService;
    private notificationsGateway;
    constructor(jwtService: JwtService, messagesService: MessagesService, webSocketServerService: WebSocketServerService, notificationsGateway: NotificationsGateway);
    onModuleInit(): void;
}
