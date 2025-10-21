import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UpdateCoordinatesSeeder } from './update-coordinates.seeder';
import { AdSeeder } from './ad.seeder';

@Controller('init')
export class InitDataController {
  constructor(
    private readonly seederService: SeederService,
    private readonly updateCoordinatesSeeder: UpdateCoordinatesSeeder,
    private readonly adSeeder: AdSeeder,
  ) {}

  @Post('base-data')
  async initBaseData() {
    try {
      await this.seederService.initializeBaseData();
      return { 
        success: true, 
        message: 'Données de base initialisées avec succès (rôles, catégories, utilisateurs)' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erreur lors de l\'initialisation des données de base', 
        details: (error as Error).message 
      };
    }
  }

  @Post('all-data')
  async initAllData() {
    try {
      await this.seederService.initializeAllData();
      return { 
        success: true, 
        message: 'Toutes les données initialisées avec succès (y compris annonces fictives)' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erreur lors de l\'initialisation complète', 
        details: (error as Error).message 
      };
    }
  }

  @Post('demo-ads')
  async seedDemoAds() {
    try {
      await this.adSeeder.seed();
      return { 
        success: true, 
        message: 'Annonces de démonstration créées avec succès' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erreur lors de la création des annonces de démonstration', 
        details: (error as Error).message 
      };
    }
  }

  @Post('update-coordinates')
  async updateCoordinates() {
    try {
      await this.updateCoordinatesSeeder.updateCoordinates();
      return { 
        success: true, 
        message: 'Coordonnées mises à jour avec succès' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erreur lors de la mise à jour des coordonnées', 
        details: (error as Error).message 
      };
    }
  }
}