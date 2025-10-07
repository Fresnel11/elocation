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
exports.UserInteraction = exports.InteractionType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const ad_entity_1 = require("../../ads/entities/ad.entity");
var InteractionType;
(function (InteractionType) {
    InteractionType["VIEW"] = "view";
    InteractionType["FAVORITE"] = "favorite";
    InteractionType["SHARE"] = "share";
    InteractionType["CONTACT"] = "contact";
    InteractionType["BOOKING"] = "booking";
})(InteractionType || (exports.InteractionType = InteractionType = {}));
let UserInteraction = class UserInteraction {
};
exports.UserInteraction = UserInteraction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserInteraction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], UserInteraction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserInteraction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ad_id' }),
    __metadata("design:type", String)
], UserInteraction.prototype, "adId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ad_entity_1.Ad),
    (0, typeorm_1.JoinColumn)({ name: 'ad_id' }),
    __metadata("design:type", ad_entity_1.Ad)
], UserInteraction.prototype, "ad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InteractionType }),
    __metadata("design:type", String)
], UserInteraction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], UserInteraction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserInteraction.prototype, "createdAt", void 0);
exports.UserInteraction = UserInteraction = __decorate([
    (0, typeorm_1.Entity)('user_interactions')
], UserInteraction);
//# sourceMappingURL=user-interaction.entity.js.map