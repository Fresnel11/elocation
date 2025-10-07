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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_analytics_entity_1 = require("../entities/user-analytics.entity");
const ad_entity_1 = require("../../ads/entities/ad.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
let AnalyticsService = class AnalyticsService {
    constructor(analyticsRepository, adRepository, bookingRepository) {
        this.analyticsRepository = analyticsRepository;
        this.adRepository = adRepository;
        this.bookingRepository = bookingRepository;
    }
    async getUserStats(userId) {
        const [ads, bookings, analytics] = await Promise.all([
            this.adRepository.find({ where: { userId } }),
            this.bookingRepository.find({ where: { ad: { userId } }, relations: ['ad'] }),
            this.getOrCreateAnalytics(userId)
        ]);
        const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
        const activeAds = ads.filter(ad => ad.isActive && ad.isAvailable).length;
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
        const occupancyRate = this.calculateOccupancyRate(bookings, ads);
        return {
            totalAds: ads.length,
            activeAds,
            totalViews,
            totalBookings: bookings.length,
            totalRevenue,
            occupancyRate,
            monthlyStats: await this.getMonthlyStats(userId),
            topPerformingAds: await this.getTopPerformingAds(userId)
        };
    }
    async getOrCreateAnalytics(userId) {
        let analytics = await this.analyticsRepository.findOne({ where: { userId } });
        if (!analytics) {
            analytics = this.analyticsRepository.create({ userId });
            await this.analyticsRepository.save(analytics);
        }
        return analytics;
    }
    calculateOccupancyRate(bookings, ads) {
        if (ads.length === 0)
            return 0;
        const totalDays = ads.length * 30;
        const bookedDays = bookings.reduce((sum, booking) => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);
        return totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;
    }
    async getMonthlyStats(userId) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const bookings = await this.bookingRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.ad', 'ad')
            .where('ad.userId = :userId', { userId })
            .andWhere('booking.createdAt >= :date', { date: sixMonthsAgo })
            .getMany();
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthBookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.createdAt);
                return bookingDate.getFullYear() === date.getFullYear() &&
                    bookingDate.getMonth() === date.getMonth();
            });
            monthlyData.push({
                month: monthKey,
                bookings: monthBookings.length,
                revenue: monthBookings.reduce((sum, b) => sum + b.totalPrice, 0)
            });
        }
        return monthlyData;
    }
    async getTopPerformingAds(userId) {
        return this.adRepository
            .createQueryBuilder('ad')
            .where('ad.userId = :userId', { userId })
            .orderBy('ad.views', 'DESC')
            .limit(5)
            .getMany();
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_analytics_entity_1.UserAnalytics)),
    __param(1, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map