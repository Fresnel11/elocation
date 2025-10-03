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
const category_seeder_1 = require("./category.seeder");
const subcategory_seeder_1 = require("./subcategory.seeder");
const update_coordinates_seeder_1 = require("./update-coordinates.seeder");
const user_seeder_1 = require("./user.seeder");
const role_seeder_1 = require("./role.seeder");
let InitDataController = class InitDataController {
    constructor(categorySeeder, subCategorySeeder, updateCoordinatesSeeder, userSeeder, roleSeeder) {
        this.categorySeeder = categorySeeder;
        this.subCategorySeeder = subCategorySeeder;
        this.updateCoordinatesSeeder = updateCoordinatesSeeder;
        this.userSeeder = userSeeder;
        this.roleSeeder = roleSeeder;
    }
    async seedData() {
        try {
            await this.roleSeeder.seed();
            await this.categorySeeder.seed();
            await this.subCategorySeeder.seed();
            await this.userSeeder.seed();
            return { message: 'Données initialisées avec succès' };
        }
        catch (error) {
            return { error: 'Erreur lors de l\'initialisation', details: error.message };
        }
    }
    async seedAdmin() {
        try {
            await this.roleSeeder.seed();
            await this.userSeeder.seed();
            return { message: 'Super admin créé avec succès' };
        }
        catch (error) {
            return { error: 'Erreur lors de la création du super admin', details: error.message };
        }
    }
    async updateCoordinates() {
        try {
            await this.updateCoordinatesSeeder.updateCoordinates();
            return { message: 'Coordonnées mises à jour avec succès' };
        }
        catch (error) {
            return { error: 'Erreur lors de la mise à jour', details: error.message };
        }
    }
};
exports.InitDataController = InitDataController;
__decorate([
    (0, common_1.Post)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitDataController.prototype, "seedData", null);
__decorate([
    (0, common_1.Post)('seed-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitDataController.prototype, "seedAdmin", null);
__decorate([
    (0, common_1.Post)('update-coordinates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitDataController.prototype, "updateCoordinates", null);
exports.InitDataController = InitDataController = __decorate([
    (0, common_1.Controller)('init'),
    __metadata("design:paramtypes", [category_seeder_1.CategorySeeder,
        subcategory_seeder_1.SubCategorySeeder,
        update_coordinates_seeder_1.UpdateCoordinatesSeeder,
        user_seeder_1.UserSeeder,
        role_seeder_1.RoleSeeder])
], InitDataController);
//# sourceMappingURL=init-data.controller.js.map