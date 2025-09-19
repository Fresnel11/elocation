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
exports.CleanupSubCategoriesSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subcategory_entity_1 = require("../subcategories/entities/subcategory.entity");
let CleanupSubCategoriesSeeder = class CleanupSubCategoriesSeeder {
    constructor(subCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }
    async cleanup() {
        var _a;
        console.log('Nettoyage des sous-catégories dupliquées...');
        const allSubCategories = await this.subCategoryRepository.find({
            relations: ['category']
        });
        const grouped = allSubCategories.reduce((acc, subCat) => {
            const key = `${subCat.name}-${subCat.categoryId}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(subCat);
            return acc;
        }, {});
        let deletedCount = 0;
        for (const [key, duplicates] of Object.entries(grouped)) {
            if (duplicates.length > 1) {
                duplicates.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                const toDelete = duplicates.slice(1);
                for (const duplicate of toDelete) {
                    await this.subCategoryRepository.remove(duplicate);
                    console.log(`Supprimé: ${duplicate.name} (${(_a = duplicate.category) === null || _a === void 0 ? void 0 : _a.name})`);
                    deletedCount++;
                }
            }
        }
        console.log(`Nettoyage terminé. ${deletedCount} doublons supprimés.`);
    }
};
exports.CleanupSubCategoriesSeeder = CleanupSubCategoriesSeeder;
exports.CleanupSubCategoriesSeeder = CleanupSubCategoriesSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CleanupSubCategoriesSeeder);
//# sourceMappingURL=cleanup-subcategories.seeder.js.map