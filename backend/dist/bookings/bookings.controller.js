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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const update_booking_dto_1 = require("./dto/update-booking.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let BookingsController = class BookingsController {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    create(createBookingDto, req) {
        return this.bookingsService.create(createBookingDto, req.user);
    }
    findMyBookings(req, paginationDto) {
        return this.bookingsService.findUserBookings(req.user.id, paginationDto);
    }
    checkAvailability(adId, startDate, endDate) {
        return this.bookingsService.getAdAvailability(adId, startDate, endDate);
    }
    findOne(id) {
        return this.bookingsService.findOne(id);
    }
    update(id, updateBookingDto, req) {
        return this.bookingsService.update(id, updateBookingDto, req.user);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer une réservation',
        description: 'Crée une nouvelle réservation pour une annonce'
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Réservation créée avec succès' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Données invalides ou dates non disponibles' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Token JWT invalide' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer mes réservations',
        description: 'Récupère les réservations de l\'utilisateur connecté'
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Liste des réservations récupérée avec succès' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Token JWT invalide' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findMyBookings", null);
__decorate([
    (0, common_1.Get)('ad/:adId/availability'),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier la disponibilité d\'une annonce',
        description: 'Vérifie si une annonce est disponible pour des dates données'
    }),
    (0, swagger_1.ApiParam)({ name: 'adId', description: 'ID de l\'annonce' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Date de début (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Date de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Disponibilité vérifiée avec succès' }),
    __param(0, (0, common_1.Param)('adId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer une réservation',
        description: 'Récupère les détails d\'une réservation'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la réservation' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Réservation trouvée avec succès' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Réservation non trouvée' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Token JWT invalide' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Modifier une réservation',
        description: 'Modifie le statut d\'une réservation'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la réservation' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Réservation modifiée avec succès' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Données invalides' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Token JWT invalide' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Pas autorisé à modifier cette réservation' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Réservation non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "update", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Réservations'),
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map