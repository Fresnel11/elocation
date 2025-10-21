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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const notification_preference_entity_1 = require("./entities/notification-preference.entity");
const search_alert_entity_1 = require("./entities/search-alert.entity");
const notifications_gateway_1 = require("./notifications.gateway");
const email_service_1 = require("./services/email.service");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository, preferenceRepository, searchAlertRepository, notificationsGateway, emailService) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.searchAlertRepository = searchAlertRepository;
        this.notificationsGateway = notificationsGateway;
        this.emailService = emailService;
    }
    async create(createNotificationDto) {
        const { userId, type, title, message, data } = createNotificationDto;
        const notification = this.notificationRepository.create({
            user: { id: userId },
            type,
            title,
            message,
            data,
        });
        const savedNotification = await this.notificationRepository.save(notification);
        const preferences = await this.getNotificationPreferences(userId);
        const typePreference = preferences.find(p => p.type === type);
        if (!typePreference || typePreference.pushEnabled) {
            this.notificationsGateway.sendNotificationToUser(userId, {
                id: savedNotification.id,
                type: savedNotification.type,
                title: savedNotification.title,
                message: savedNotification.message,
                data: savedNotification.data,
                createdAt: savedNotification.createdAt,
            });
        }
        if (!typePreference || typePreference.emailEnabled) {
        }
        return savedNotification;
    }
    async createNotification(userId, type, title, message, data) {
        return this.create({ userId, type, title, message, data });
    }
    async getUserNotifications(userId, page = 1, limit = 20) {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data: notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async markAsRead(notificationId, userId) {
        await this.notificationRepository.update({ id: notificationId, user: { id: userId } }, { read: true });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ user: { id: userId }, read: false }, { read: true });
    }
    async deleteNotification(notificationId, userId) {
        const result = await this.notificationRepository.delete({
            id: notificationId,
            user: { id: userId }
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Notification non trouvée');
        }
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.count({
            where: { user: { id: userId }, read: false },
        });
    }
    async notifyBookingRequest(ownerId, bookingData) {
        return this.createNotification(ownerId, notification_entity_1.NotificationType.BOOKING_REQUEST, 'Nouvelle demande de réservation', `${bookingData.tenantName} souhaite réserver "${bookingData.adTitle}"`, { bookingId: bookingData.bookingId, adId: bookingData.adId });
    }
    async notifyBookingConfirmed(tenantId, bookingData) {
        const notification = await this.createNotification(tenantId, notification_entity_1.NotificationType.BOOKING_CONFIRMED, 'Réservation confirmée', `Votre demande pour "${bookingData.adTitle}" a été acceptée`, {
            bookingId: bookingData.bookingId,
            adId: bookingData.adId,
            paymentRequired: true,
            paymentLink: bookingData.paymentLink
        });
        if (bookingData.userEmail && bookingData.userName && bookingData.paymentLink) {
            const emailBookingData = {
                ad: { title: bookingData.adTitle },
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                totalAmount: bookingData.totalAmount,
                securityDeposit: bookingData.securityDeposit
            };
            await this.emailService.sendBookingConfirmationEmail(bookingData.userEmail, bookingData.userName, emailBookingData, bookingData.paymentLink);
        }
        return notification;
    }
    async notifyBookingCancelled(userId, bookingData, reason) {
        return this.createNotification(userId, notification_entity_1.NotificationType.BOOKING_CANCELLED, 'Réservation annulée', `La réservation pour "${bookingData.adTitle}" a été annulée${reason ? `: ${reason}` : ''}`, { bookingId: bookingData.bookingId, adId: bookingData.adId, reason });
    }
    async createSearchAlert(userId, createSearchAlertDto) {
        const alert = this.searchAlertRepository.create(Object.assign(Object.assign({}, createSearchAlertDto), { userId, isActive: true }));
        return this.searchAlertRepository.save(alert);
    }
    async getUserSearchAlerts(userId) {
        return this.searchAlertRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
    async updateSearchAlert(id, userId, updateData) {
        const alert = await this.searchAlertRepository.findOne({ where: { id, userId } });
        if (!alert) {
            throw new common_1.NotFoundException('Search alert not found');
        }
        Object.assign(alert, updateData);
        return this.searchAlertRepository.save(alert);
    }
    async deleteSearchAlert(id, userId) {
        const result = await this.searchAlertRepository.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Search alert not found');
        }
    }
    async getNotificationPreferences(userId) {
        return this.preferenceRepository.find({ where: { userId } });
    }
    async updateNotificationPreference(userId, updateDto) {
        const { type, emailEnabled, pushEnabled } = updateDto;
        let preference = await this.preferenceRepository.findOne({ where: { userId, type } });
        if (!preference) {
            preference = this.preferenceRepository.create({ userId, type, emailEnabled, pushEnabled });
        }
        else {
            preference.emailEnabled = emailEnabled;
            preference.pushEnabled = pushEnabled;
        }
        return this.preferenceRepository.save(preference);
    }
    async updateNotificationPreferenceLegacy(userId, type, emailEnabled, pushEnabled) {
        return this.updateNotificationPreference(userId, { type: type, emailEnabled, pushEnabled });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(notification_preference_entity_1.NotificationPreference)),
    __param(2, (0, typeorm_1.InjectRepository)(search_alert_entity_1.SearchAlert)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway,
        email_service_1.EmailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map