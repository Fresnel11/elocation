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
exports.BookingsCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
let BookingsCronService = class BookingsCronService {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async expireOldPendingBookings() {
        console.log('🔄 Vérification des demandes de réservation expirées...');
        const twoDaysAgo = new Date();
        twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
        const expiredBookings = await this.bookingRepository.update({
            status: booking_entity_1.BookingStatus.PENDING,
            createdAt: (0, typeorm_2.LessThan)(twoDaysAgo),
        }, {
            status: booking_entity_1.BookingStatus.EXPIRED,
            cancellationReason: 'Demande expirée - Aucune réponse du propriétaire dans les 48h',
        });
        if (expiredBookings.affected && expiredBookings.affected > 0) {
            console.log(`✅ ${expiredBookings.affected} demande(s) de réservation expirée(s)`);
        }
    }
};
exports.BookingsCronService = BookingsCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsCronService.prototype, "expireOldPendingBookings", null);
exports.BookingsCronService = BookingsCronService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookingsCronService);
//# sourceMappingURL=bookings.cron.js.map