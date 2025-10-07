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
exports.Referral = exports.ReferralStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ReferralStatus;
(function (ReferralStatus) {
    ReferralStatus["PENDING"] = "pending";
    ReferralStatus["COMPLETED"] = "completed";
    ReferralStatus["REWARDED"] = "rewarded";
})(ReferralStatus || (exports.ReferralStatus = ReferralStatus = {}));
let Referral = class Referral {
};
exports.Referral = Referral;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Referral.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referrer_id' }),
    __metadata("design:type", String)
], Referral.prototype, "referrerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'referrer_id' }),
    __metadata("design:type", user_entity_1.User)
], Referral.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referred_id' }),
    __metadata("design:type", String)
], Referral.prototype, "referredId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'referred_id' }),
    __metadata("design:type", user_entity_1.User)
], Referral.prototype, "referred", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_code' }),
    __metadata("design:type", String)
], Referral.prototype, "referralCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReferralStatus, default: ReferralStatus.PENDING }),
    __metadata("design:type", String)
], Referral.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reward_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Referral.prototype, "rewardAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Referral.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Referral.prototype, "updatedAt", void 0);
exports.Referral = Referral = __decorate([
    (0, typeorm_1.Entity)('referrals')
], Referral);
//# sourceMappingURL=referral.entity.js.map