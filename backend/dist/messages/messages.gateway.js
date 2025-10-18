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
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const jwt_1 = require("@nestjs/jwt");
const WebSocket = require("ws");
const url = require("url");
let MessagesGateway = class MessagesGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.clients = new Map();
    }
    handleConnection(client, request) {
        try {
            const query = url.parse(request.url, true).query;
            const token = query.token;
            if (!token) {
                client.close();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            this.clients.set(userId, client);
            console.log(`User ${userId} connected via WebSocket`);
            client.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(userId, message);
                }
                catch (error) {
                    console.error('Error parsing message:', error);
                }
            });
        }
        catch (error) {
            console.error('WebSocket connection error:', error);
            client.close();
        }
    }
    handleDisconnect(client) {
        for (const [userId, ws] of this.clients.entries()) {
            if (ws === client) {
                this.clients.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    }
    handleMessage(userId, message) {
    }
    sendToUser(userId, data) {
        const client = this.clients.get(userId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    }
    broadcast(data) {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
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
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", ws_1.Server)
], MessagesGateway.prototype, "server", void 0);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ port: 3002 }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map