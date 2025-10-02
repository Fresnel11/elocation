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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async sendMessage(req, createMessageDto) {
        return this.messagesService.sendMessage(req.user.id, createMessageDto);
    }
    async getConversations(req) {
        return this.messagesService.getConversations(req.user.id);
    }
    async getMessages(req, adId, otherUserId) {
        const actualAdId = adId === 'direct' || adId === '' ? null : adId;
        console.log('Regular endpoint called with adId:', adId, 'converted to:', actualAdId);
        return this.messagesService.getMessages(req.user.id, actualAdId, otherUserId);
    }
    async getDirectMessages(req, otherUserId) {
        console.log('Direct messages endpoint called for:', otherUserId);
        return this.messagesService.getMessages(req.user.id, null, otherUserId);
    }
    async markAsRead(req, adId, otherUserId) {
        const actualAdId = adId === 'direct' || adId === '' ? null : adId;
        console.log('Mark as read called with adId:', adId, 'converted to:', actualAdId);
        await this.messagesService.markMessagesAsRead(req.user.id, otherUserId, actualAdId);
        return { success: true };
    }
    async markDirectAsRead(req, otherUserId) {
        console.log('Mark direct as read called for:', otherUserId);
        await this.messagesService.markMessagesAsRead(req.user.id, otherUserId, null);
        return { success: true };
    }
    async getUnreadCount(req) {
        return this.messagesService.getUnreadCount(req.user.id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversation/:adId/:otherUserId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('adId')),
    __param(2, (0, common_1.Param)('otherUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('conversation/direct/:otherUserId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('otherUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getDirectMessages", null);
__decorate([
    (0, common_1.Post)('mark-read/:adId/:otherUserId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('adId')),
    __param(2, (0, common_1.Param)('otherUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-read/direct/:otherUserId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('otherUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markDirectAsRead", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getUnreadCount", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map