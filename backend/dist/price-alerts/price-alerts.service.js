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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceAlertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const price_alert_entity_1 = require("./entities/price-alert.entity");
const favorite_entity_1 = require("../favorites/entities/favorite.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let PriceAlertsService = class PriceAlertsService {
    constructor(priceAlertRepository, favoriteRepository, notificationsService) {
        this.priceAlertRepository = priceAlertRepository;
        this.favoriteRepository = favoriteRepository;
        this.notificationsService = notificationsService;
    }
    async checkPriceChanges(adId, newPrice, previousPrice) {
        if (newPrice === previousPrice)
            return;
        const favorites = await this.favoriteRepository.find({
            where: { ad: { id: adId } },
            relations: ['user', 'ad']
        });
        for (const favorite of favorites) {
            await this.createPriceAlert(favorite.user.id, adId, previousPrice, newPrice);
            const priceChange = newPrice > previousPrice ? 'augmenté' : 'baissé';
            const changeAmount = Math.abs(newPrice - previousPrice);
            await this.notificationsService.createNotification(favorite.user.id, notification_entity_1.NotificationType.PRICE_CHANGE, `Prix ${priceChange}`, `Le prix de "${favorite.ad.title}" a ${priceChange} de ${changeAmount.toLocaleString()} FCFA`, { adId, previousPrice, newPrice });
        }
    }
    async createPriceAlert(userId, adId, previousPrice, newPrice) {
        const alert = this.priceAlertRepository.create({
            user: { id: userId },
            ad: { id: adId },
            previousPrice,
            newPrice
        });
        return this.priceAlertRepository.save(alert);
    }
    async getUserPriceAlerts(userId) {
        return this.priceAlertRepository.find({
            where: { user: { id: userId } },
            relations: ['ad'],
            order: { createdAt: 'DESC' }
        });
    }
    async markAsRead(alertId) {
        await this.priceAlertRepository.update(alertId, { isRead: true });
    }
};
exports.PriceAlertsService = PriceAlertsService;
exports.PriceAlertsService = PriceAlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(price_alert_entity_1.PriceAlert)),
    __param(1, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], PriceAlertsService);
//# sourceMappingURL=price-alerts.service.js.map