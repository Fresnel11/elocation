import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';

async function runSeeders() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🌱 Démarrage des seeders...');
    
    const categorySeeder = app.get(CategorySeeder);
    await categorySeeder.seed();
    console.log('✅ Catégories créées');
    
    const subCategorySeeder = app.get(SubCategorySeeder);
    await subCategorySeeder.seed();
    console.log('✅ Sous-catégories créées');
    
    console.log('🎉 Seeders terminés avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await app.close();
  }
}

runSeeders();