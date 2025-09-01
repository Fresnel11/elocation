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
let InitDataController = class InitDataController {
    constructor(categorySeeder, subCategorySeeder) {
        this.categorySeeder = categorySeeder;
        this.subCategorySeeder = subCategorySeeder;
    }
    async seedData() {
        try {
            await this.categorySeeder.seed();
            await this.subCategorySeeder.seed();
            return { message: 'Données initialisées avec succès' };
        }
        catch (error) {
            return { error: 'Erreur lors de l\'initialisation', details: error.message };
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
exports.InitDataController = InitDataController = __decorate([
    (0, common_1.Controller)('init'),
    __metadata("design:paramtypes", [category_seeder_1.CategorySeeder,
        subcategory_seeder_1.SubCategorySeeder])
], InitDataController);
//# sourceMappingURL=init-data.controller.js.map