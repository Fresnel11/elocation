import { Injectable } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
import { CleanupSubCategoriesSeeder } from './cleanup-subcategories.seeder';
import { UserSeeder } from './user.seeder';
import { AdSeeder } from './ad.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly categorySeeder: CategorySeeder,
    private readonly subCategorySeeder: SubCategorySeeder,
    private readonly cleanupSubCategoriesSeeder: CleanupSubCategoriesSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly adSeeder: AdSeeder,
    private readonly permissionSeeder: PermissionSeeder,
    private readonly rolePermissionSeeder: RolePermissionSeeder,
  ) {}

  // Méthode publique pour initialiser les données de base (sans les annonces)
  async initializeBaseData() {
    console.log('🚀 Initialisation des données de base...');
    await this.seedRoles();
    await this.seedPermissions();
    await this.seedRolePermissions();
    await this.seedCategories();
    await this.cleanupSubCategories();
    await this.seedSubCategories();
    await this.seedUsers();
    console.log('✅ Données de base initialisées avec succès');
  }

  // Méthode publique pour initialiser TOUTES les données (y compris annonces fictives)
  async initializeAllData() {
    console.log('🚀 Initialisation complète des données...');
    await this.initializeBaseData();
    await this.seedAds();
    console.log('✅ Toutes les données initialisées avec succès');
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

  private async cleanupSubCategories() {
    try {
      await this.cleanupSubCategoriesSeeder.cleanup();
      console.log('Nettoyage des sous-catégories terminé');
    } catch (error) {
      console.error('Erreur lors du nettoyage des sous-catégories:', error);
    }
  }

  private async seedSubCategories() {
    try {
      await this.subCategorySeeder.seed();
      console.log('Seeding des sous-catégories terminé');
    } catch (error) {
      console.error('Erreur lors du seeding des sous-catégories:', error);
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

  private async seedPermissions() {
    try {
      await this.permissionSeeder.seed();
      console.log('Seeding des permissions terminé');
    } catch (error) {
      console.error('Erreur lors du seeding des permissions:', error);
    }
  }

  private async seedRolePermissions() {
    try {
      await this.rolePermissionSeeder.seed();
      console.log('Attribution des permissions aux rôles terminée');
    } catch (error) {
      console.error('Erreur lors de l\'attribution des permissions:', error);
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