import { Controller, Post } from '@nestjs/common';
import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';

@Controller('init')
export class InitDataController {
  constructor(
    private readonly categorySeeder: CategorySeeder,
    private readonly subCategorySeeder: SubCategorySeeder,
  ) {}

  @Post('seed')
  async seedData() {
    try {
      await this.categorySeeder.seed();
      await this.subCategorySeeder.seed();
      return { message: 'Données initialisées avec succès' };
    } catch (error) {
      return { error: 'Erreur lors de l\'initialisation', details: error.message };
    }
  }
}