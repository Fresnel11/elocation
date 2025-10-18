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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_public_key_dto_1 = require("./dto/update-public-key.dto");
const submit_verification_dto_1 = require("./dto/submit-verification.dto");
const review_verification_dto_1 = require("./dto/review-verification.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const reviews_service_1 = require("../reviews/reviews.service");
let UsersController = class UsersController {
    constructor(usersService, reviewsService) {
        this.usersService = usersService;
        this.reviewsService = reviewsService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(paginationDto) {
        return this.usersService.findAll(paginationDto);
    }
    async updateProfile(req, updateProfileDto) {
        console.log('=== UPDATE PROFILE DEBUG ===');
        console.log('Headers:', req.headers.authorization);
        console.log('User from JWT:', req.user);
        console.log('Received profile update data:', updateProfileDto);
        console.log('============================');
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }
    async getProfile(req) {
        const user = await this.usersService.findOne(req.user.id);
        return Object.assign(Object.assign({}, user.profile), { phone: user.phone });
    }
    updatePublicKey(req, updatePublicKeyDto) {
        return this.usersService.updatePublicKey(req.user.id, updatePublicKeyDto.publicKey);
    }
    getPublicKey(id) {
        return this.usersService.getPublicKey(id);
    }
    getPublicProfile(id) {
        return this.usersService.getPublicProfile(id);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto, req) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
    toggleStatus(id) {
        return this.usersService.toggleUserStatus(id);
    }
    async uploadAvatar(req, avatarUrl) {
        return this.usersService.uploadAvatar(req.user.id, avatarUrl);
    }
    async getUserReputation(id) {
        const reviews = await this.reviewsService.getUserReviews(id);
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                reputationLevel: 'Nouveau',
                reputationScore: 0
            };
        }
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        const totalReviews = reviews.length;
        let reputationLevel = 'Nouveau';
        let reputationScore = 0;
        if (averageRating >= 4.5 && totalReviews >= 10) {
            reputationLevel = 'Excellent';
            reputationScore = 90 + Math.min(10, totalReviews - 10);
        }
        else if (averageRating >= 4 && totalReviews >= 5) {
            reputationLevel = 'Très bon';
            reputationScore = 70 + (averageRating - 4) * 40;
        }
        else if (averageRating >= 3.5 && totalReviews >= 3) {
            reputationLevel = 'Bon';
            reputationScore = 50 + (averageRating - 3.5) * 40;
        }
        else if (totalReviews > 0) {
            reputationLevel = 'Moyen';
            reputationScore = Math.max(20, averageRating * 20);
        }
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
            reputationLevel,
            reputationScore: Math.min(100, Math.round(reputationScore))
        };
    }
    async submitVerification(req, submitVerificationDto) {
        return this.usersService.submitVerification(req.user.id, submitVerificationDto);
    }
    async getPendingVerifications() {
        return this.usersService.getPendingVerifications();
    }
    async reviewVerification(id, reviewDto, req) {
        return this.usersService.reviewVerification(id, reviewDto, req.user.id);
    }
    async getVerificationStatus(req) {
        const verification = await this.usersService.getUserVerification(req.user.id);
        const user = await this.usersService.findOne(req.user.id);
        return {
            isVerified: user.isVerified,
            verification
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer un nouvel utilisateur',
        description: 'Crée un nouvel utilisateur. Réservé aux administrateurs.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
        description: 'Informations de l\'utilisateur à créer'
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Utilisateur créé avec succès'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données invalides'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Accès réservé aux administrateurs'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les utilisateurs',
        description: 'Récupère la liste de tous les utilisateurs avec pagination. Réservé aux administrateurs.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Numéro de page', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des utilisateurs récupérée avec succès'
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
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le profil utilisateur' }),
    (0, swagger_1.ApiBody)({ type: update_profile_dto_1.UpdateProfileDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le profil utilisateur' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('public-key'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour la clé publique pour le chiffrement E2E' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_public_key_dto_1.UpdatePublicKeyDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updatePublicKey", null);
__decorate([
    (0, common_1.Get)(':id/public-key'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer la clé publique d\'un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getPublicKey", null);
__decorate([
    (0, common_1.Get)(':id/profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer le profil public d\'un utilisateur',
        description: 'Récupère les informations publiques d\'un utilisateur (nom, date d\'inscription, statistiques).'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Profil utilisateur récupéré avec succès'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getPublicProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer un utilisateur par ID',
        description: 'Récupère les détails d\'un utilisateur spécifique.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Utilisateur trouvé avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Modifier un utilisateur',
        description: 'Modifie un utilisateur existant. Les utilisateurs peuvent modifier leur propre profil, les admins peuvent modifier n\'importe quel profil.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur à modifier' }),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        description: 'Informations à modifier dans le profil utilisateur'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Utilisateur modifié avec succès'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données invalides'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Vous n\'êtes pas autorisé à modifier ce profil'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer un utilisateur',
        description: 'Supprime un utilisateur. Réservé aux administrateurs.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur à supprimer' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Utilisateur supprimé avec succès'
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
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Basculer le statut d\'un utilisateur',
        description: 'Active ou désactive un utilisateur. Réservé aux administrateurs.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Statut de l\'utilisateur basculé avec succès'
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
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Uploader un avatar' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('avatarUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)(':id/reputation'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer la réputation d\'un utilisateur',
        description: 'Récupère les statistiques de réputation basées sur les avis reçus.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Réputation récupérée avec succès'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserReputation", null);
__decorate([
    (0, common_1.Post)('verification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre une demande de vérification d\'identité' }),
    (0, swagger_1.ApiBody)({ type: submit_verification_dto_1.SubmitVerificationDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_verification_dto_1.SubmitVerificationDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "submitVerification", null);
__decorate([
    (0, common_1.Get)('verification/pending'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les demandes de vérification en attente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPendingVerifications", null);
__decorate([
    (0, common_1.Patch)('verification/:id/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Approuver ou rejeter une demande de vérification' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la demande de vérification' }),
    (0, swagger_1.ApiBody)({ type: review_verification_dto_1.ReviewVerificationDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_verification_dto_1.ReviewVerificationDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reviewVerification", null);
__decorate([
    (0, common_1.Get)('verification/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Vérifier le statut de vérification de l\'utilisateur' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getVerificationStatus", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Utilisateurs'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        reviews_service_1.ReviewsService])
], UsersController);
//# sourceMappingURL=users.controller.js.map