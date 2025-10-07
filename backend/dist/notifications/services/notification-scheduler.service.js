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
exports.NotificationSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const search_alert_entity_1 = require("../entities/search-alert.entity");
const ad_entity_1 = require("../../ads/entities/ad.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const email_service_1 = require("./email.service");
const notifications_service_1 = require("../notifications.service");
let NotificationSchedulerService = class NotificationSchedulerService {
    constructor(searchAlertRepository, adRepository, bookingRepository, emailService, notificationsService) {
        this.searchAlertRepository = searchAlertRepository;
        this.adRepository = adRepository;
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
    }
    async checkNewAdMatches() {
        const alerts = await this.searchAlertRepository.find({
            where: { isActive: true },
            relations: ['user'],
        });
        for (const alert of alerts) {
            const query = this.adRepository.createQueryBuilder('ad')
                .leftJoinAndSelect('ad.category', 'category')
                .where('ad.isActive = :isActive', { isActive: true })
                .andWhere('ad.createdAt > :lastNotified', {
                lastNotified: alert.lastNotifiedAt || new Date(Date.now() - 24 * 60 * 60 * 1000)
            });
            if (alert.location) {
                query.andWhere('ad.location ILIKE :location', { location: `%${alert.location}%` });
            }
            if (alert.categoryId) {
                query.andWhere('ad.categoryId = :categoryId', { categoryId: alert.categoryId });
            }
            if (alert.minPrice) {
                query.andWhere('ad.price >= :minPrice', { minPrice: alert.minPrice });
            }
            if (alert.maxPrice) {
                query.andWhere('ad.price <= :maxPrice', { maxPrice: alert.maxPrice });
            }
            if (alert.bedrooms) {
                query.andWhere('ad.bedrooms >= :bedrooms', { bedrooms: alert.bedrooms });
            }
            if (alert.bathrooms) {
                query.andWhere('ad.bathrooms >= :bathrooms', { bathrooms: alert.bathrooms });
            }
            const matchingAds = await query.getMany();
            if (matchingAds.length > 0) {
                await this.emailService.sendNewAdMatchEmail(alert.user.email, alert.user.firstName, matchingAds);
                await this.notificationsService.createNotification(alert.userId, 'NEW_AD_MATCH', 'Nouvelles annonces disponibles', `${matchingAds.length} nouvelle(s) annonce(s) correspondent à votre alerte "${alert.name}"`, { alertId: alert.id, adCount: matchingAds.length });
                alert.lastNotifiedAt = new Date();
                await this.searchAlertRepository.save(alert);
            }
        }
    }
    async sendBookingReminders() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        const bookings = await this.bookingRepository.find({
            where: {
                startDate: (0, typeorm_2.Between)(tomorrow, dayAfterTomorrow),
                status: booking_entity_1.BookingStatus.CONFIRMED
            },
            relations: ['tenant', 'ad'],
        });
        for (const booking of bookings) {
            await this.emailService.sendBookingReminderEmail(booking.tenant.email, booking.tenant.firstName, booking);
            await this.notificationsService.createNotification(booking.tenant.id, 'BOOKING_REMINDER', 'Rappel de réservation', `Votre réservation pour "${booking.ad.title}" commence demain`, { bookingId: booking.id });
        }
    }
};
exports.NotificationSchedulerService = NotificationSchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationSchedulerService.prototype, "checkNewAdMatches", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationSchedulerService.prototype, "sendBookingReminders", null);
exports.NotificationSchedulerService = NotificationSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(search_alert_entity_1.SearchAlert)),
    __param(1, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        notifications_service_1.NotificationsService])
], NotificationSchedulerService);
//# sourceMappingURL=notification-scheduler.service.js.map