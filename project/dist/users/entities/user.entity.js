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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const ad_entity_1 = require("../../ads/entities/ad.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255, unique: true, nullable: true }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", Object)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 512, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 6, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "otpExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_role_enum_1.UserRole,
        default: user_role_enum_1.UserRole.USER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ad_entity_1.Ad, (ad) => ad.user),
    __metadata("design:type", Array)
], User.prototype, "ads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.user),
    __metadata("design:type", Array)
], User.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map