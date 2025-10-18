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
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const WebSocket = require("ws");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(NotificationsGateway_1.name);
        this.clients = new Map();
    }
    addClient(userId, ws) {
        this.clients.set(userId, ws);
        this.logger.log(`User ${userId} connected to notifications`);
    }
    removeClient(userId) {
        this.clients.delete(userId);
        this.logger.log(`User ${userId} disconnected from notifications`);
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
    sendNotificationToUser(userId, notification) {
        this.sendToUser(userId, { type: 'notification', data: notification });
    }
    sendBroadcastNotification(notification) {
        this.broadcast({ type: 'broadcast_notification', data: notification });
    }
    notifyAdminsNewVerification(verification) {
        this.broadcast({ type: 'new_verification', data: verification });
    }
    notifyVerificationStatus(userId, status, reason) {
        this.sendNotificationToUser(userId, {
            type: 'verification_status',
            status,
            reason,
            timestamp: new Date()
        });
    }
};
exports.NotificationsGateway = NotificationsGateway;
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map