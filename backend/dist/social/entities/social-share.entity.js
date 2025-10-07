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
exports.SocialShare = exports.SharePlatform = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const ad_entity_1 = require("../../ads/entities/ad.entity");
var SharePlatform;
(function (SharePlatform) {
    SharePlatform["FACEBOOK"] = "facebook";
    SharePlatform["TWITTER"] = "twitter";
    SharePlatform["WHATSAPP"] = "whatsapp";
    SharePlatform["TELEGRAM"] = "telegram";
    SharePlatform["LINK"] = "link";
})(SharePlatform || (exports.SharePlatform = SharePlatform = {}));
let SocialShare = class SocialShare {
};
exports.SocialShare = SocialShare;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SocialShare.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], SocialShare.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SocialShare.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ad_id' }),
    __metadata("design:type", String)
], SocialShare.prototype, "adId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ad_entity_1.Ad),
    (0, typeorm_1.JoinColumn)({ name: 'ad_id' }),
    __metadata("design:type", ad_entity_1.Ad)
], SocialShare.prototype, "ad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SharePlatform }),
    __metadata("design:type", String)
], SocialShare.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SocialShare.prototype, "createdAt", void 0);
exports.SocialShare = SocialShare = __decorate([
    (0, typeorm_1.Entity)('social_shares')
], SocialShare);
//# sourceMappingURL=social-share.entity.js.map