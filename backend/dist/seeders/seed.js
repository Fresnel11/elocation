"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const category_seeder_1 = require("./category.seeder");
const subcategory_seeder_1 = require("./subcategory.seeder");
async function runSeeders() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        console.log('🌱 Démarrage des seeders...');
        const categorySeeder = app.get(category_seeder_1.CategorySeeder);
        await categorySeeder.seed();
        console.log('✅ Catégories créées');
        const subCategorySeeder = app.get(subcategory_seeder_1.SubCategorySeeder);
        await subCategorySeeder.seed();
        console.log('✅ Sous-catégories créées');
        console.log('🎉 Seeders terminés avec succès!');
    }
    catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
    }
    finally {
        await app.close();
    }
}
runSeeders();
//# sourceMappingURL=seed.js.map