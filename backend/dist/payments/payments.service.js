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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const payment_entity_1 = require("./entities/payment.entity");
const payment_status_enum_1 = require("../common/enums/payment-status.enum");
const uuid_1 = require("uuid");
let PaymentsService = class PaymentsService {
    constructor(paymentRepository, configService) {
        this.paymentRepository = paymentRepository;
        this.configService = configService;
    }
    async initiatePayment(createPaymentDto, user) {
        const payment = this.paymentRepository.create(Object.assign(Object.assign({}, createPaymentDto), { transactionId: (0, uuid_1.v4)(), userId: user.id, status: payment_status_enum_1.PaymentStatus.PENDING }));
        const savedPayment = await this.paymentRepository.save(payment);
        await this.simulateMobileMoneyRequest(savedPayment);
        return savedPayment;
    }
    async verifyPayment(verifyPaymentDto, user) {
        const payment = await this.paymentRepository.findOne({
            where: {
                transactionId: verifyPaymentDto.transactionCode,
                userId: user.id
            },
            relations: ['user'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== payment_status_enum_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Payment has already been processed');
        }
        const isPaymentSuccessful = await this.simulatePaymentVerification(payment);
        if (isPaymentSuccessful) {
            payment.status = payment_status_enum_1.PaymentStatus.COMPLETED;
            payment.externalTransactionId = `EXT_${Date.now()}`;
        }
        else {
            payment.status = payment_status_enum_1.PaymentStatus.FAILED;
        }
        return this.paymentRepository.save(payment);
    }
    async findUserPayments(userId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [payments, total] = await this.paymentRepository.findAndCount({
            where: { userId },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            payments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findAllPayments(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [payments, total] = await this.paymentRepository.findAndCount({
            relations: ['user'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            payments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async hasValidPaymentForRealEstate(userId) {
        const payment = await this.paymentRepository.findOne({
            where: {
                userId,
                status: payment_status_enum_1.PaymentStatus.COMPLETED,
                description: 'Real Estate Contact Access',
            },
            order: { createdAt: 'DESC' },
        });
        if (!payment) {
            return false;
        }
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return payment.createdAt > thirtyDaysAgo;
    }
    async simulateMobileMoneyRequest(payment) {
        console.log(`Initiating ${payment.provider.toUpperCase()} Mobile Money payment:`, {
            amount: payment.amount,
            phoneNumber: payment.phoneNumber,
            transactionId: payment.transactionId,
        });
    }
    async simulatePaymentVerification(payment) {
        const isSuccessful = Math.random() < 0.8;
        console.log(`Payment verification for ${payment.transactionId}:`, isSuccessful ? 'SUCCESS' : 'FAILED');
        return isSuccessful;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map