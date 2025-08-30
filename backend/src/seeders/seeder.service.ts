import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { CategorySeeder } from './category.seeder';
import { UserSeeder } from './user.seeder';
import { AdSeeder } from './ad.seeder';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly categorySeeder: CategorySeeder,
    private readonly userSeeder: UserSeeder,
    private readonly adSeeder: AdSeeder,
  ) {}

  async onModuleInit() {
    // Force l'exécution des seeders
    await this.seedRoles();
    await this.seedCategories();
    await this.seedUsers();
    await this.seedAds();
  }

  private async seedRoles() {
    try {
      await this.roleSeeder.seed();
      console.log('Seeding des rôles terminé');
    } catch (error) {
      console.error('Erreur lors du seeding des rôles:', error);
    }
  }

  private async seedCategories() {
    try {
      await this.categorySeeder.seed();
      console.log('Seeding des catégories terminé');
    } catch (error) {
      console.error('Erreur lors du seeding des catégories:', error);
    }
  }

  private async seedUsers() {
    try {
      await this.userSeeder.seed();
      console.log('Seeding des utilisateurs terminé');
    } catch (error) {
      console.error('Erreur lors du seeding des utilisateurs:', error);
    }
  }

  private async seedAds() {
    try {
      await this.adSeeder.seed();
      console.log('Seeding des annonces terminé');
    } catch (error) {
      console.error('Erreur lors du seeding des annonces:', error);
    }
  }
}