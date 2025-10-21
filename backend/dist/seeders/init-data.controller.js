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
exports.InitDataController = void 0;
const common_1 = require("@nestjs/common");
const seeder_service_1 = require("./seeder.service");
const update_coordinates_seeder_1 = require("./update-coordinates.seeder");
const ad_seeder_1 = require("./ad.seeder");
let InitDataController = class InitDataController {
    constructor(seederService, updateCoordinatesSeeder, adSeeder) {
        this.seederService = seederService;
        this.updateCoordinatesSeeder = updateCoordinatesSeeder;
        this.adSeeder = adSeeder;
    }
    async initBaseData() {
        try {
            await this.seederService.initializeBaseData();
            return {
                success: true,
                message: 'Données de base initialisées avec succès (rôles, catégories, utilisateurs)'
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Erreur lors de l\'initialisation des données de base',
                details: error.message
            };
        }
    }
    async initAllData() {
        try {
            await this.seederService.initializeAllData();
            return {
                success: true,
                message: 'Toutes les données initialisées avec succès (y compris annonces fictives)'
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Erreur lors de l\'initialisation complète',
                details: error.message
            };
        }
    }
    async seedDemoAds() {
        try {
            await this.adSeeder.seed();
            return {
                success: true,
                message: 'Annonces de démonstration créées avec succès'
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Erreur lors de la création des annonces de démonstration',
                details: error.message
            };
        }
    }
    async updateCoordinates() {
        try {
            await this.updateCoordinatesSeeder.updateCoordinates();
            return {
                success: true,
                message: 'Coordonnées mises à jour avec succès'
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Erreur lors de la mise à jour des coordonnées',
                details: error.message
            };
        }
    }
};
exports.InitDataController = InitDataController;
__decorate([
    (0, common_1.Post)('base-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitDataController.prototype, "initBaseData", null);
__decorate([
    (0, common_1.Post)('all-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitDataController.prototype, "initAllData", null);
__decorate([
    (0, common_1.Post)('demo-ads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitDataController.prototype, "seedDemoAds", null);
__decorate([
    (0, common_1.Post)('update-coordinates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitDataController.prototype, "updateCoordinates", null);
exports.InitDataController = InitDataController = __decorate([
    (0, common_1.Controller)('init'),
    __metadata("design:paramtypes", [seeder_service_1.SeederService,
        update_coordinates_seeder_1.UpdateCoordinatesSeeder,
        ad_seeder_1.AdSeeder])
], InitDataController);
//# sourceMappingURL=init-data.controller.js.map