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
exports.NotificationCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const search_alert_entity_1 = require("../entities/search-alert.entity");
const ad_entity_1 = require("../../ads/entities/ad.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const notifications_service_1 = require("../notifications.service");
const email_service_1 = require("./email.service");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationCronService = class NotificationCronService {
    constructor(searchAlertRepository, adRepository, bookingRepository, notificationsService, emailService) {
        this.searchAlertRepository = searchAlertRepository;
        this.adRepository = adRepository;
        this.bookingRepository = bookingRepository;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
    }
    async checkNewAdMatches() {
        console.log('🔍 Vérification des nouvelles annonces...');
        const activeAlerts = await this.searchAlertRepository.find({
            where: { isActive: true },
            relations: ['user'],
        });
        for (const alert of activeAlerts) {
            try {
                const lastCheck = alert.lastNotifiedAt || new Date(Date.now() - 24 * 60 * 60 * 1000);
                const query = this.adRepository.createQueryBuilder('ad')
                    .leftJoinAndSelect('ad.category', 'category')
                    .leftJoinAndSelect('ad.user', 'user')
                    .where('ad.isActive = :isActive', { isActive: true })
                    .andWhere('ad.isAvailable = :isAvailable', { isAvailable: true })
                    .andWhere('ad.createdAt > :lastCheck', { lastCheck })
                    .andWhere('ad.userId != :userId', { userId: alert.userId });
                if (alert.location) {
                    query.andWhere('ad.location ILIKE :location', {
                        location: `%${alert.location}%`
                    });
                }
                if (alert.categoryId) {
                    query.andWhere('ad.categoryId = :categoryId', {
                        categoryId: alert.categoryId
                    });
                }
                if (alert.minPrice) {
                    query.andWhere('ad.price >= :minPrice', {
                        minPrice: alert.minPrice
                    });
                }
                if (alert.maxPrice) {
                    query.andWhere('ad.price <= :maxPrice', {
                        maxPrice: alert.maxPrice
                    });
                }
                if (alert.bedrooms) {
                    query.andWhere('ad.bedrooms >= :bedrooms', {
                        bedrooms: alert.bedrooms
                    });
                }
                if (alert.bathrooms) {
                    query.andWhere('ad.bathrooms >= :bathrooms', {
                        bathrooms: alert.bathrooms
                    });
                }
                const matchingAds = await query.getMany();
                if (matchingAds.length > 0) {
                    await this.notificationsService.createNotification(alert.userId, notification_entity_1.NotificationType.NEW_AD_MATCH, 'Nouvelles annonces disponibles', `${matchingAds.length} nouvelle(s) annonce(s) correspondent à votre alerte "${alert.name}"`, {
                        alertId: alert.id,
                        alertName: alert.name,
                        adCount: matchingAds.length,
                        ads: matchingAds.slice(0, 3).map(ad => ({
                            id: ad.id,
                            title: ad.title,
                            price: ad.price,
                            location: ad.location
                        }))
                    });
                    await this.emailService.sendNewAdMatchEmail(alert.user.email, alert.user.firstName, matchingAds.slice(0, 5));
                    alert.lastNotifiedAt = new Date();
                    await this.searchAlertRepository.save(alert);
                    console.log(`✅ ${matchingAds.length} annonce(s) trouvée(s) pour l'alerte "${alert.name}"`);
                }
            }
            catch (error) {
                console.error(`❌ Erreur lors de la vérification de l'alerte ${alert.id}:`, error);
            }
        }
    }
    async sendBookingReminders() {
        console.log('📅 Envoi des rappels de réservation...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        const upcomingBookings = await this.bookingRepository.find({
            where: {
                startDate: (0, typeorm_2.Between)(tomorrow, dayAfterTomorrow),
                status: booking_entity_1.BookingStatus.CONFIRMED
            },
            relations: ['tenant', 'ad', 'owner'],
        });
        for (const booking of upcomingBookings) {
            try {
                await this.notificationsService.createNotification(booking.tenant.id, notification_entity_1.NotificationType.BOOKING_REMINDER, 'Rappel de réservation', `Votre réservation pour "${booking.ad.title}" commence demain`, {
                    bookingId: booking.id,
                    adId: booking.ad.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                });
                await this.emailService.sendBookingReminderEmail(booking.tenant.email, booking.tenant.firstName, booking);
                console.log(`✅ Rappel envoyé pour la réservation ${booking.id}`);
            }
            catch (error) {
                console.error(`❌ Erreur lors de l'envoi du rappel pour la réservation ${booking.id}:`, error);
            }
        }
    }
    async cleanupOldNotifications() {
        console.log('🧹 Nettoyage des anciennes notifications...');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        try {
            const result = await this.notificationsService['notificationRepository']
                .createQueryBuilder()
                .delete()
                .where('createdAt < :date AND read = :read', {
                date: thirtyDaysAgo,
                read: true
            })
                .execute();
            console.log(`✅ ${result.affected} anciennes notifications supprimées`);
        }
        catch (error) {
            console.error('❌ Erreur lors du nettoyage des notifications:', error);
        }
    }
};
exports.NotificationCronService = NotificationCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationCronService.prototype, "checkNewAdMatches", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationCronService.prototype, "sendBookingReminders", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * 0'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationCronService.prototype, "cleanupOldNotifications", null);
exports.NotificationCronService = NotificationCronService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(search_alert_entity_1.SearchAlert)),
    __param(1, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService])
], NotificationCronService);
//# sourceMappingURL=notification-cron.service.js.map