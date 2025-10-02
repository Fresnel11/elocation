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
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const role_seeder_1 = require("./role.seeder");
const category_seeder_1 = require("./category.seeder");
const subcategory_seeder_1 = require("./subcategory.seeder");
const cleanup_subcategories_seeder_1 = require("./cleanup-subcategories.seeder");
const user_seeder_1 = require("./user.seeder");
const ad_seeder_1 = require("./ad.seeder");
let SeederService = class SeederService {
    constructor(roleSeeder, categorySeeder, subCategorySeeder, cleanupSubCategoriesSeeder, userSeeder, adSeeder) {
        this.roleSeeder = roleSeeder;
        this.categorySeeder = categorySeeder;
        this.subCategorySeeder = subCategorySeeder;
        this.cleanupSubCategoriesSeeder = cleanupSubCategoriesSeeder;
        this.userSeeder = userSeeder;
        this.adSeeder = adSeeder;
    }
    async onModuleInit() {
        await this.seedRoles();
        await this.seedCategories();
        await this.cleanupSubCategories();
        await this.seedSubCategories();
        await this.seedUsers();
        await this.seedAds();
    }
    async seedRoles() {
        try {
            await this.roleSeeder.seed();
            console.log('Seeding des rôles terminé');
        }
        catch (error) {
            console.error('Erreur lors du seeding des rôles:', error);
        }
    }
    async seedCategories() {
        try {
            await this.categorySeeder.seed();
            console.log('Seeding des catégories terminé');
        }
        catch (error) {
            console.error('Erreur lors du seeding des catégories:', error);
        }
    }
    async cleanupSubCategories() {
        try {
            await this.cleanupSubCategoriesSeeder.cleanup();
            console.log('Nettoyage des sous-catégories terminé');
        }
        catch (error) {
            console.error('Erreur lors du nettoyage des sous-catégories:', error);
        }
    }
    async seedSubCategories() {
        try {
            await this.subCategorySeeder.seed();
            console.log('Seeding des sous-catégories terminé');
        }
        catch (error) {
            console.error('Erreur lors du seeding des sous-catégories:', error);
        }
    }
    async seedUsers() {
        try {
            await this.userSeeder.seed();
            console.log('Seeding des utilisateurs terminé');
        }
        catch (error) {
            console.error('Erreur lors du seeding des utilisateurs:', error);
        }
    }
    async seedAds() {
        try {
            await this.adSeeder.seed();
            console.log('Seeding des annonces terminé');
        }
        catch (error) {
            console.error('Erreur lors du seeding des annonces:', error);
        }
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_seeder_1.RoleSeeder,
        category_seeder_1.CategorySeeder,
        subcategory_seeder_1.SubCategorySeeder,
        cleanup_subcategories_seeder_1.CleanupSubCategoriesSeeder,
        user_seeder_1.UserSeeder,
        ad_seeder_1.AdSeeder])
], SeederService);
//# sourceMappingURL=seeder.service.js.map