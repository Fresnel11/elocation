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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const ads_service_1 = require("./ads.service");
const create_ad_dto_1 = require("./dto/create-ad.dto");
const update_ad_dto_1 = require("./dto/update-ad.dto");
const search_ads_dto_1 = require("./dto/search-ads.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let AdsController = class AdsController {
    constructor(adsService) {
        this.adsService = adsService;
    }
    create(createAdDto, req) {
        return this.adsService.create(createAdDto, req.user);
    }
    findAll(searchAdsDto, userCity, req) {
        var _a;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        return this.adsService.findAll(searchAdsDto, userCity, userId);
    }
    findUserAds(userId, paginationDto) {
        return this.adsService.findUserAds(userId, paginationDto);
    }
    findMyAds(req, paginationDto) {
        return this.adsService.findUserAds(req.user.id, paginationDto);
    }
    findOne(id, req) {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        return this.adsService.findOne(id, userId);
    }
    redirectToWhatsapp(id) {
        return this.adsService.redirectToWhatsapp(id);
    }
    update(id, updateAdDto, req) {
        return this.adsService.update(id, updateAdDto, req.user);
    }
    remove(id, req) {
        return this.adsService.remove(id, req.user);
    }
    toggleStatus(id, req) {
        return this.adsService.toggleAdStatus(id, req.user);
    }
    uploadPhotos(id, files, req) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const photoUrls = files.map(file => `/uploads/${file.filename}`);
        return this.adsService.uploadPhotos(id, photoUrls, req.user);
    }
};
exports.AdsController = AdsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer une nouvelle annonce',
        description: 'Crée une nouvelle annonce pour l\'utilisateur connecté.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_ad_dto_1.CreateAdDto,
        description: 'Informations de l\'annonce à créer'
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Annonce créée avec succès',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                location: { type: 'string' },
                whatsappNumber: { type: 'string' },
                categoryId: { type: 'string' },
                isAvailable: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données invalides ou validation échouée'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ad_dto_1.CreateAdDto, Object]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer toutes les annonces avec filtres',
        description: 'Récupère la liste des annonces avec possibilité de filtrage, recherche et pagination.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Recherche textuelle' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, description: 'ID de la catégorie' }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, description: 'Prix minimum en FCFA' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, description: 'Prix maximum en FCFA' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, description: 'Localisation' }),
    (0, swagger_1.ApiQuery)({ name: 'isAvailable', required: false, description: 'Disponibilité' }),
    (0, swagger_1.ApiQuery)({ name: 'userCity', required: false, description: 'Ville de l\'utilisateur pour tri géographique' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Numéro de page', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Champ de tri', enum: ['createdAt', 'price', 'title', 'location'] }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Ordre de tri', enum: ['ASC', 'DESC'], example: 'DESC' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des annonces récupérée avec succès',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            price: { type: 'number' },
                            location: { type: 'string' },
                            isAvailable: { type: 'boolean' },
                            category: { type: 'object' },
                            user: { type: 'object' },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' }
            }
        }
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('userCity')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_ads_dto_1.SearchAdsDto, String, Object]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les annonces d\'un utilisateur',
        description: 'Récupère la liste des annonces publiques d\'un utilisateur spécifique.'
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID de l\'utilisateur' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Numéro de page', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des annonces de l\'utilisateur récupérée avec succès'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Utilisateur non trouvé'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "findUserAds", null);
__decorate([
    (0, common_1.Get)('my-ads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer mes annonces',
        description: 'Récupère la liste des annonces créées par l\'utilisateur connecté.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Numéro de page', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Nombre d\'éléments par page', example: 10 }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Liste des annonces de l\'utilisateur récupérée avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "findMyAds", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer une annonce par ID',
        description: 'Récupère les détails d\'une annonce spécifique.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'annonce' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Annonce trouvée avec succès'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Annonce non trouvée'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/whatsapp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Rediriger vers WhatsApp',
        description: 'Redirige vers WhatsApp avec le numéro de contact de l\'annonce.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'annonce' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Redirection WhatsApp réussie'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Annonce non trouvée'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "redirectToWhatsapp", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Modifier une annonce',
        description: 'Modifie une annonce existante. Seul le créateur peut modifier son annonce.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'annonce à modifier' }),
    (0, swagger_1.ApiBody)({
        type: update_ad_dto_1.UpdateAdDto,
        description: 'Informations à modifier dans l\'annonce'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Annonce modifiée avec succès'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Données invalides'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Vous n\'êtes pas autorisé à modifier cette annonce'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Annonce non trouvée'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ad_dto_1.UpdateAdDto, Object]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Supprimer une annonce',
        description: 'Supprime une annonce. Seul le créateur peut supprimer son annonce.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'annonce à supprimer' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Annonce supprimée avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Vous n\'êtes pas autorisé à supprimer cette annonce'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Annonce non trouvée'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Basculer le statut de disponibilité',
        description: 'Change le statut de disponibilité d\'une annonce (disponible/indisponible).'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'annonce' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Statut basculé avec succès'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Vous n\'êtes pas autorisé à modifier cette annonce'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Annonce non trouvée'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Post)(':id/upload-photos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Uploader des photos pour une annonce',
        description: 'Ajoute des photos à une annonce existante. Maximum 5 photos, formats acceptés: JPG, PNG, GIF.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de l\'annonce' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                photos: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Photos à uploader (max 5)',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Photos uploadées avec succès'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Aucun fichier uploadé ou format non supporté'
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT invalide ou expiré'
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Vous n\'êtes pas autorisé à modifier cette annonce'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Annonce non trouvée'
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('photos', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: parseInt((_a = process.env.MAX_FILE_SIZE) !== null && _a !== void 0 ? _a : '5242880') || 5242880,
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "uploadPhotos", null);
exports.AdsController = AdsController = __decorate([
    (0, swagger_1.ApiTags)('Annonces'),
    (0, common_1.Controller)('ads'),
    __metadata("design:paramtypes", [ads_service_1.AdsService])
], AdsController);
//# sourceMappingURL=ads.controller.js.map