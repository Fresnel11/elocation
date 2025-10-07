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
exports.UpdateNotificationPreferenceDto = void 0;
const class_validator_1 = require("class-validator");
const notification_preference_entity_1 = require("../entities/notification-preference.entity");
class UpdateNotificationPreferenceDto {
}
exports.UpdateNotificationPreferenceDto = UpdateNotificationPreferenceDto;
__decorate([
    (0, class_validator_1.IsEnum)(notification_preference_entity_1.NotificationType),
    __metadata("design:type", String)
], UpdateNotificationPreferenceDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationPreferenceDto.prototype, "emailEnabled", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationPreferenceDto.prototype, "pushEnabled", void 0);
//# sourceMappingURL=update-notification-preference.dto.js.map