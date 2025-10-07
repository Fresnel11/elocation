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
exports.LoyaltyPoints = exports.PointType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var PointType;
(function (PointType) {
    PointType["REFERRAL"] = "referral";
    PointType["BOOKING"] = "booking";
    PointType["REVIEW"] = "review";
    PointType["BONUS"] = "bonus";
})(PointType || (exports.PointType = PointType = {}));
let LoyaltyPoints = class LoyaltyPoints {
};
exports.LoyaltyPoints = LoyaltyPoints;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoyaltyPoints.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], LoyaltyPoints.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], LoyaltyPoints.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PointType }),
    __metadata("design:type", String)
], LoyaltyPoints.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LoyaltyPoints.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LoyaltyPoints.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], LoyaltyPoints.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LoyaltyPoints.prototype, "createdAt", void 0);
exports.LoyaltyPoints = LoyaltyPoints = __decorate([
    (0, typeorm_1.Entity)('loyalty_points')
], LoyaltyPoints);
//# sourceMappingURL=loyalty-points.entity.js.map