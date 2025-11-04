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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonerooService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let MonerooService = class MonerooService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('MONEROO_BASE_URL');
        this.apiKey = this.configService.get('MONEROO_API_KEY');
    }
    async initializePayment(paymentData) {
        var _a, _b;
        try {
            const response = await this.httpService.axiosRef.post(`${this.baseUrl}/payments/initialize`, {
                amount: paymentData.amount,
                currency: paymentData.currency,
                description: paymentData.description,
                customer: {
                    email: paymentData.customer.email,
                    first_name: paymentData.customer.firstName,
                    last_name: paymentData.customer.lastName,
                    phone: paymentData.customer.phone,
                },
                return_url: paymentData.returnUrl,
                metadata: paymentData.metadata,
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message, ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500);
        }
    }
    async verifyPayment(paymentId) {
        var _a, _b;
        try {
            const response = await this.httpService.axiosRef.get(`${this.baseUrl}/payments/${paymentId}/verify`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message, ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500);
        }
    }
    async initializePayout(amount, recipient) {
        var _a, _b;
        try {
            const response = await this.httpService.axiosRef.post(`${this.baseUrl}/payouts/initialize`, Object.assign({ amount, currency: 'XOF' }, recipient), {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message, ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500);
        }
    }
};
exports.MonerooService = MonerooService;
exports.MonerooService = MonerooService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MonerooService);
//# sourceMappingURL=moneroo.service.js.map