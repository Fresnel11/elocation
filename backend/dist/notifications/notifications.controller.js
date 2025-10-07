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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const notifications_service_1 = require("./notifications.service");
const push_notification_service_1 = require("./services/push-notification.service");
const create_search_alert_dto_1 = require("./dto/create-search-alert.dto");
const update_notification_preference_dto_1 = require("./dto/update-notification-preference.dto");
let NotificationsController = class NotificationsController {
    constructor(notificationsService, pushNotificationService) {
        this.notificationsService = notificationsService;
        this.pushNotificationService = pushNotificationService;
    }
    async getNotifications(req, page = 1, limit = 20) {
        return this.notificationsService.getUserNotifications(req.user.id, page, limit);
    }
    async getUnreadCount(req) {
        const count = await this.notificationsService.getUnreadCount(req.user.id);
        return { count };
    }
    async markAsRead(id, req) {
        await this.notificationsService.markAsRead(id, req.user.id);
        return { success: true };
    }
    async deleteNotification(id, req) {
        await this.notificationsService.deleteNotification(id, req.user.id);
        return { success: true };
    }
    async markAllAsRead(req) {
        await this.notificationsService.markAllAsRead(req.user.id);
        return { success: true };
    }
    async createSearchAlert(req, createSearchAlertDto) {
        return this.notificationsService.createSearchAlert(req.user.id, createSearchAlertDto);
    }
    async getUserSearchAlerts(req) {
        return this.notificationsService.getUserSearchAlerts(req.user.id);
    }
    async updateSearchAlert(req, id, updateData) {
        return this.notificationsService.updateSearchAlert(id, req.user.id, updateData);
    }
    async deleteSearchAlert(req, id) {
        return this.notificationsService.deleteSearchAlert(id, req.user.id);
    }
    async getNotificationPreferences(req) {
        return this.notificationsService.getNotificationPreferences(req.user.id);
    }
    async updateNotificationPreference(req, updateDto) {
        return this.notificationsService.updateNotificationPreference(req.user.id, updateDto);
    }
    async subscribeToPush(req, subscriptionData) {
        return { success: true };
    }
    async unsubscribeFromPush(req) {
        return { success: true };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les notifications de l\'utilisateur' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Nombre de notifications non lues' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer une notification comme lue' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une notification' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer toutes les notifications comme lues' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Post)('search-alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une alerte de recherche' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_search_alert_dto_1.CreateSearchAlertDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createSearchAlert", null);
__decorate([
    (0, common_1.Get)('search-alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les alertes de recherche' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserSearchAlerts", null);
__decorate([
    (0, common_1.Patch)('search-alerts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier une alerte de recherche' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateSearchAlert", null);
__decorate([
    (0, common_1.Delete)('search-alerts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une alerte de recherche' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteSearchAlert", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les préférences de notifications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationPreferences", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier les préférences de notifications' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_notification_preference_dto_1.UpdateNotificationPreferenceDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotificationPreference", null);
__decorate([
    (0, common_1.Post)('push-subscription'),
    (0, swagger_1.ApiOperation)({ summary: 'S\'abonner aux notifications push' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "subscribeToPush", null);
__decorate([
    (0, common_1.Delete)('push-subscription'),
    (0, swagger_1.ApiOperation)({ summary: 'Se désabonner des notifications push' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "unsubscribeFromPush", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        push_notification_service_1.PushNotificationService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map