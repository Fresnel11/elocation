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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const verify_payment_dto_1 = require("./dto/verify-payment.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    initiatePayment(createPaymentDto, req) {
        return this.paymentsService.initiatePayment(createPaymentDto, req.user);
    }
    verifyPayment(verifyPaymentDto, req) {
        return this.paymentsService.verifyPayment(verifyPaymentDto, req.user);
    }
    findMyPayments(req, paginationDto) {
        return this.paymentsService.findUserPayments(req.user.id, paginationDto);
    }
    findAllPayments(paginationDto) {
        return this.paymentsService.findAllPayments(paginationDto);
    }
    checkRealEstateAccess(userId) {
        return this.paymentsService.hasValidPaymentForRealEstate(userId);
    }
    findOne(id) {
        return this.paymentsService.findOne(id);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Initier un paiement',
        description: 'Crée un nouveau paiement avec le statut PENDING. Le paiement doit être vérifié ensuite.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_payment_dto_1.CreatePaymentDto,
        description: 'Informations du paiement à initier'
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Paiement initié avec succès'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données invalides'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier un paiement',
        description: 'Vérifie un paiement initié. Simule la vérification avec un taux de succès de 80%.'
    }),
    (0, swagger_1.ApiBody)({
        type: verify_payment_dto_1.VerifyPaymentDto,
        description: 'Informations de vérification du paiement'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Paiement vérifié avec succès'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données invalides'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Paiement non trouvé'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_payment_dto_1.VerifyPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('my-payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer mes paiements',
        description: 'Récupère la liste des paiements de l\'utilisateur connecté.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Numéro de page', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des paiements récupérée avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findMyPayments", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les paiements',
        description: 'Récupère la liste de tous les paiements. Réservé aux administrateurs.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Numéro de page', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste de tous les paiements récupérée avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAllPayments", null);
__decorate([
    (0, common_1.Get)('real-estate-access/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier l\'accès immobilier d\'un utilisateur',
        description: 'Vérifie si un utilisateur a un paiement valide pour accéder aux contacts immobiliers. Réservé aux administrateurs.'
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID de l\'utilisateur à vérifier' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Accès immobilier vérifié avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "checkRealEstateAccess", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un paiement par ID',
        description: 'Récupère les détails d\'un paiement spécifique.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du paiement' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Paiement trouvé avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Paiement non trouvé'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOne", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Paiements'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map