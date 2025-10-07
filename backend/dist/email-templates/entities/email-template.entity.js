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
exports.EmailTemplate = exports.EmailTemplateType = void 0;
const typeorm_1 = require("typeorm");
var EmailTemplateType;
(function (EmailTemplateType) {
    EmailTemplateType["WELCOME"] = "welcome";
    EmailTemplateType["BOOKING_CONFIRMATION"] = "booking_confirmation";
    EmailTemplateType["BOOKING_CANCELLED"] = "booking_cancelled";
    EmailTemplateType["AD_APPROVED"] = "ad_approved";
    EmailTemplateType["AD_REJECTED"] = "ad_rejected";
    EmailTemplateType["REVIEW_NOTIFICATION"] = "review_notification";
    EmailTemplateType["PASSWORD_RESET"] = "password_reset";
})(EmailTemplateType || (exports.EmailTemplateType = EmailTemplateType = {}));
let EmailTemplate = class EmailTemplate {
};
exports.EmailTemplate = EmailTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmailTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EmailTemplateType, unique: true }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmailTemplate.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], EmailTemplate.prototype, "htmlContent", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "textContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], EmailTemplate.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Array)
], EmailTemplate.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmailTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmailTemplate.prototype, "updatedAt", void 0);
exports.EmailTemplate = EmailTemplate = __decorate([
    (0, typeorm_1.Entity)('email_templates')
], EmailTemplate);
//# sourceMappingURL=email-template.entity.js.map