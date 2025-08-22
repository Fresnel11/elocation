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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    getPendingAds() {
        return this.adminService.getPendingAds();
    }
    moderateAd(id, action) {
        return this.adminService.moderateAd(id, action);
    }
    getRecentUsers(limit) {
        return this.adminService.getRecentUsers(limit ? parseInt(limit) : 10);
    }
    getRecentPayments(limit) {
        return this.adminService.getRecentPayments(limit ? parseInt(limit) : 10);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les statistiques du dashboard',
        description: 'Récupère les statistiques globales pour le tableau de bord administrateur.'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Statistiques récupérées avec succès',
        schema: {
            type: 'object',
            properties: {
                totalUsers: { type: 'number', description: 'Nombre total d\'utilisateurs' },
                totalAds: { type: 'number', description: 'Nombre total d\'annonces' },
                pendingAds: { type: 'number', description: 'Nombre d\'annonces en attente' },
                totalPayments: { type: 'number', description: 'Nombre total de paiements' },
                totalRevenue: { type: 'number', description: 'Revenus totaux' }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('pending-ads'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les annonces en attente de modération',
        description: 'Récupère la liste des annonces qui nécessitent une modération (approbation/rejet).'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des annonces en attente récupérée avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingAds", null);
__decorate([
    (0, common_1.Patch)('ads/:id/moderate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Modérer une annonce',
        description: 'Approuve ou rejette une annonce en attente de modération.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'annonce à modérer' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['approve', 'reject'],
                    description: 'Action à effectuer sur l\'annonce'
                }
            },
            required: ['action']
        }
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Annonce modérée avec succès'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Action invalide'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Annonce non trouvée'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "moderateAd", null);
__decorate([
    (0, common_1.Get)('recent-users'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les utilisateurs récents',
        description: 'Récupère la liste des utilisateurs les plus récemment inscrits.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Nombre d\'utilisateurs à récupérer',
        example: 10
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des utilisateurs récents récupérée avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentUsers", null);
__decorate([
    (0, common_1.Get)('recent-payments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les paiements récents',
        description: 'Récupère la liste des paiements les plus récents.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Nombre de paiements à récupérer',
        example: 10
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des paiements récents récupérée avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentPayments", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Administration'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map