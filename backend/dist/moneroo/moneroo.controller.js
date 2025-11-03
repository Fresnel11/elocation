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
exports.MonerooController = void 0;
const common_1 = require("@nestjs/common");
const moneroo_service_1 = require("./moneroo.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const payout_dto_1 = require("./dto/payout.dto");
const bookings_service_1 = require("../bookings/bookings.service");
let MonerooController = class MonerooController {
    constructor(monerooService, bookingsService) {
        this.monerooService = monerooService;
        this.bookingsService = bookingsService;
    }
    async createPayment(createPaymentDto) {
        const { amount, currency, metadata } = createPaymentDto;
        const paymentData = {
            amount,
            currency,
            description: (metadata === null || metadata === void 0 ? void 0 : metadata.description) || 'Payment',
            customer: (metadata === null || metadata === void 0 ? void 0 : metadata.customer) || {
                email: 'customer@example.com',
                firstName: 'Customer',
                lastName: 'Name'
            },
            returnUrl: (metadata === null || metadata === void 0 ? void 0 : metadata.returnUrl) || `${process.env.FRONTEND_URL}/payment/return`,
            metadata
        };
        return await this.monerooService.initializePayment(paymentData);
    }
    async webhook(req, res) {
        var _a;
        const event = req.body;
        console.log('Webhook Moneroo reçu :', event);
        try {
            if (event.status === 'success' && ((_a = event.metadata) === null || _a === void 0 ? void 0 : _a.bookingId)) {
                await this.bookingsService.confirmPayment(event.metadata.bookingId, {
                    payment_id: event.payment_id,
                    amount: event.amount,
                    currency: event.currency,
                });
                console.log(`Paiement confirmé pour la réservation ${event.metadata.bookingId}`);
            }
        }
        catch (error) {
            console.error('Erreur lors du traitement du webhook Moneroo:', error);
        }
        return res.status(200).send('OK');
    }
    async releaseFunds(payoutDto) {
        const { amount, recipient } = payoutDto;
        return await this.monerooService.initializePayout(amount, recipient);
    }
    async verifyPayment(paymentId) {
        return await this.monerooService.verifyPayment(paymentId);
    }
    async paymentReturn(query, res) {
        const { paymentId, paymentStatus, bookingId } = query;
        try {
            if (paymentStatus === 'success' && paymentId) {
                const verification = await this.monerooService.verifyPayment(paymentId);
                if (verification.status === 'success' && bookingId) {
                    await this.bookingsService.confirmPayment(bookingId, {
                        payment_id: paymentId,
                        amount: verification.amount,
                        currency: verification.currency,
                    });
                    return res.redirect(`${process.env.FRONTEND_URL}/booking/${bookingId}?payment=success`);
                }
            }
            return res.redirect(`${process.env.FRONTEND_URL}/booking/${bookingId}?payment=failed`);
        }
        catch (error) {
            console.error('Erreur lors du retour de paiement:', error);
            return res.redirect(`${process.env.FRONTEND_URL}/booking/${bookingId}?payment=error`);
        }
    }
};
exports.MonerooController = MonerooController;
__decorate([
    (0, common_1.Post)('create-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], MonerooController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MonerooController.prototype, "webhook", null);
__decorate([
    (0, common_1.Post)('release-funds'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_dto_1.PayoutDto]),
    __metadata("design:returntype", Promise)
], MonerooController.prototype, "releaseFunds", null);
__decorate([
    (0, common_1.Get)('verify/:paymentId'),
    __param(0, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonerooController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('payment/return'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MonerooController.prototype, "paymentReturn", null);
exports.MonerooController = MonerooController = __decorate([
    (0, common_1.Controller)('moneroo'),
    __metadata("design:paramtypes", [moneroo_service_1.MonerooService,
        bookings_service_1.BookingsService])
], MonerooController);
//# sourceMappingURL=moneroo.controller.js.map