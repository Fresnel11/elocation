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
const pagination_dto_1 = require("../common/dto/pagination.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(paginationDto) {
        return this.usersService.findAll(paginationDto);
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
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Utilisateurs'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map