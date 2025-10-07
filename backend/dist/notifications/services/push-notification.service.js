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
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const webpush = require("web-push");
let PushNotificationService = class PushNotificationService {
    constructor() {
        if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
            webpush.setVapidDetails('mailto:' + (process.env.VAPID_EMAIL || 'admin@elocation.bj'), process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
        }
    }
    async sendPushNotification(subscription, title, message, data) {
        const payload = JSON.stringify({
            title,
            body: message,
            icon: '/assets/elocation-512.png',
            badge: '/assets/elocation-512.png',
            data: data || {},
            actions: [
                {
                    action: 'view',
                    title: 'Voir',
                },
                {
                    action: 'close',
                    title: 'Fermer',
                }
            ]
        });
        try {
            await webpush.sendNotification(subscription, payload);
        }
        catch (error) {
            console.error('Erreur envoi notification push:', error);
        }
    }
    async sendBookingRequestPush(subscription, adTitle, tenantName) {
        await this.sendPushNotification(subscription, 'Nouvelle demande de réservation', `${tenantName} souhaite réserver "${adTitle}"`, { type: 'booking_request' });
    }
    async sendBookingConfirmedPush(subscription, adTitle) {
        await this.sendPushNotification(subscription, 'Réservation confirmée', `Votre demande pour "${adTitle}" a été acceptée`, { type: 'booking_confirmed' });
    }
    async sendNewAdMatchPush(subscription, alertName, adCount) {
        await this.sendPushNotification(subscription, 'Nouvelles annonces disponibles', `${adCount} nouvelle(s) annonce(s) correspondent à votre alerte "${alertName}"`, { type: 'new_ad_match' });
    }
};
exports.PushNotificationService = PushNotificationService;
exports.PushNotificationService = PushNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PushNotificationService);
//# sourceMappingURL=push-notification.service.js.map