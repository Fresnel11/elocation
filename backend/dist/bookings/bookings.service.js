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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const ads_service_1 = require("../ads/ads.service");
const notifications_service_1 = require("../notifications/notifications.service");
let BookingsService = class BookingsService {
    constructor(bookingRepository, adsService, notificationsService) {
        this.bookingRepository = bookingRepository;
        this.adsService = adsService;
        this.notificationsService = notificationsService;
    }
    async create(createBookingDto, user) {
        const { adId, startDate, endDate, message, deposit } = createBookingDto;
        const ad = await this.adsService.findOne(adId);
        if (!ad) {
            throw new common_1.NotFoundException('Annonce non trouvée');
        }
        if (ad.user.id === user.id) {
            throw new common_1.BadRequestException('Vous ne pouvez pas réserver votre propre annonce');
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            throw new common_1.BadRequestException('La date de fin doit être après la date de début');
        }
        if (start < new Date()) {
            throw new common_1.BadRequestException('La date de début ne peut pas être dans le passé');
        }
        const conflictingBookings = await this.bookingRepository.find({
            where: {
                ad: { id: adId },
                status: booking_entity_1.BookingStatus.CONFIRMED,
                startDate: (0, typeorm_2.Between)(start, end),
            },
        });
        if (conflictingBookings.length > 0) {
            throw new common_1.BadRequestException('Ces dates ne sont pas disponibles');
        }
        let totalPrice;
        const timeDiff = end.getTime() - start.getTime();
        switch (ad.paymentMode) {
            case 'hourly':
                const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
                totalPrice = hours * parseFloat(String(ad.price));
                break;
            case 'daily':
                const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                totalPrice = days * parseFloat(String(ad.price));
                break;
            case 'weekly':
                const weeks = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
                totalPrice = weeks * parseFloat(String(ad.price));
                break;
            case 'monthly':
                const months = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 30));
                totalPrice = months * parseFloat(String(ad.price));
                break;
            case 'fixed':
            default:
                totalPrice = parseFloat(String(ad.price));
                break;
        }
        const booking = this.bookingRepository.create({
            ad,
            tenant: user,
            owner: ad.user,
            startDate: start,
            endDate: end,
            totalPrice,
            deposit: deposit || totalPrice * 0.2,
            message,
            status: booking_entity_1.BookingStatus.PENDING,
        });
        const savedBooking = await this.bookingRepository.save(booking);
        await this.notificationsService.notifyBookingRequest(ad.user.id, {
            bookingId: savedBooking.id,
            adId: ad.id,
            adTitle: ad.title,
            tenantName: `${user.firstName} ${user.lastName}`,
        });
        return savedBooking;
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const [bookings, total] = await this.bookingRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findUserBookings(userId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const [bookings, total] = await this.bookingRepository.findAndCount({
            where: { tenant: { id: userId } },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOwnerBookings(userId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const [bookings, total] = await this.bookingRepository.findAndCount({
            where: { owner: { id: userId } },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Réservation non trouvée');
        }
        return booking;
    }
    async update(id, updateBookingDto, user) {
        const booking = await this.findOne(id);
        if (booking.owner.id !== user.id && booking.tenant.id !== user.id) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à modifier cette réservation');
        }
        if (updateBookingDto.status === booking_entity_1.BookingStatus.CONFIRMED && booking.owner.id !== user.id) {
            throw new common_1.ForbiddenException('Seul le propriétaire peut confirmer une réservation');
        }
        Object.assign(booking, updateBookingDto);
        const updatedBooking = await this.bookingRepository.save(booking);
        if (updateBookingDto.status === booking_entity_1.BookingStatus.CONFIRMED) {
            await this.notificationsService.notifyBookingConfirmed(booking.tenant.id, {
                bookingId: booking.id,
                adId: booking.ad.id,
                adTitle: booking.ad.title,
            });
        }
        else if (updateBookingDto.status === booking_entity_1.BookingStatus.CANCELLED) {
            const targetUserId = user.id === booking.owner.id ? booking.tenant.id : booking.owner.id;
            await this.notificationsService.notifyBookingCancelled(targetUserId, {
                bookingId: booking.id,
                adId: booking.ad.id,
                adTitle: booking.ad.title,
            }, updateBookingDto.cancellationReason);
        }
        return updatedBooking;
    }
    async getAdAvailability(adId, startDate, endDate) {
        const query = this.bookingRepository.createQueryBuilder('booking')
            .where('booking.adId = :adId', { adId })
            .andWhere('booking.status = :status', { status: booking_entity_1.BookingStatus.CONFIRMED });
        if (startDate && endDate) {
            query.andWhere('(booking.startDate BETWEEN :startDate AND :endDate OR booking.endDate BETWEEN :startDate AND :endDate)', { startDate, endDate });
        }
        const bookings = await query.getMany();
        return {
            isAvailable: bookings.length === 0,
            conflictingBookings: bookings,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ads_service_1.AdsService,
        notifications_service_1.NotificationsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map