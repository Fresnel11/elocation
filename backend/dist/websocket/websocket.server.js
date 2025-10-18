"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServerService = void 0;
const common_1 = require("@nestjs/common");
const ws_1 = require("ws");
const jwt_1 = require("@nestjs/jwt");
const url = require("url");
let WebSocketServerService = class WebSocketServerService {
    constructor(jwtService) {
        this.clients = new Map();
        this.jwtService = jwtService;
        this.wss = new ws_1.WebSocketServer({ port: 3002 });
        this.wss.on('connection', (ws, request) => {
            this.handleConnection(ws, request);
        });
        console.log('WebSocket server started on port 3002');
    }
    setNotificationsGateway(notificationsGateway) {
        this.notificationsGateway = notificationsGateway;
    }
    handleConnection(ws, request) {
        try {
            const query = url.parse(request.url, true).query;
            const token = query.token;
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
            ws.send(JSON.stringify({ type: 'connected', data: { userId, message: 'Successfully connected' } }));
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(userId, message, ws);
                }
                catch (error) {
                    console.error('Error parsing message:', error);
                }
            });
            ws.on('close', () => {
                this.clients.delete(userId);
                console.log(`User ${userId} disconnected`);
            });
        }
        catch (error) {
            console.error('WebSocket connection error:', error);
            ws.close();
        }
    }
    handleMessage(userId, message, ws) {
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
    sendToUser(userId, data) {
        const client = this.clients.get(userId);
        if (client && client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    }
    broadcast(data) {
        this.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(data));
            }
        });
    }
    emitNewMessage(message) {
        this.sendToUser(message.senderId, { type: 'new_message', data: message });
        this.sendToUser(message.receiverId, { type: 'new_message', data: message });
    }
    emitUnreadCountUpdate(userId, unreadCount) {
        this.sendToUser(userId, { type: 'unread_count_update', data: { unreadCount } });
    }
};
exports.WebSocketServerService = WebSocketServerService;
exports.WebSocketServerService = WebSocketServerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], WebSocketServerService);
//# sourceMappingURL=websocket.server.js.map