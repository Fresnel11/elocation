import { Controller, Post } from '@nestjs/common';
import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
import { UpdateCoordinatesSeeder } from './update-coordinates.seeder';
import { UserSeeder } from './user.seeder';
import { RoleSeeder } from './role.seeder';

@Controller('init')
export class InitDataController {
  constructor(
    private readonly categorySeeder: CategorySeeder,
    private readonly subCategorySeeder: SubCategorySeeder,
    private readonly updateCoordinatesSeeder: UpdateCoordinatesSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly roleSeeder: RoleSeeder,
  ) {}

  @Post('seed')
  async seedData() {
    try {
      await this.roleSeeder.seed();
      await this.categorySeeder.seed();
      await this.subCategorySeeder.seed();
      await this.userSeeder.seed();
      return { message: 'Données initialisées avec succès' };
    } catch (error) {
      return { error: 'Erreur lors de l\'initialisation', details: (error as Error).message };
    }
  }

  @Post('seed-admin')
  async seedAdmin() {
    try {
      await this.roleSeeder.seed();
      await this.userSeeder.seed();
      return { message: 'Super admin créé avec succès' };
    } catch (error) {
      return { error: 'Erreur lors de la création du super admin', details: (error as Error).message };
    }
  }

  @Post('update-coordinates')
  async updateCoordinates() {
    try {
      await this.updateCoordinatesSeeder.updateCoordinates();
      return { message: 'Coordonnées mises à jour avec succès' };
    } catch (error) {
      return { error: 'Erreur lors de la mise à jour', details: (error as Error).message };
    }
  }
}