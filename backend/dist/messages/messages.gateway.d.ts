import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'ws';
import { JwtService } from '@nestjs/jwt';
import * as WebSocket from 'ws';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private clients;
    constructor(jwtService: JwtService);
    handleConnection(client: WebSocket, request: any): void;
    handleDisconnect(client: WebSocket): void;
    private handleMessage;
    sendToUser(userId: string, data: any): void;
    broadcast(data: any): void;
    emitNewMessage(message: any): void;
    emitUnreadCountUpdate(userId: string, unreadCount: number): void;
}
