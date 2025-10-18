import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    try {
      // Désactiver les contraintes de clés étrangères temporairement
      await this.categoryRepository.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // Supprimer dans l'ordre pour éviter les contraintes FK
      await this.categoryRepository.query('DELETE FROM reviews');
      console.log('Reviews supprimées');
      
      await this.categoryRepository.query('DELETE FROM favorites');
      console.log('Favoris supprimés');
      
      await this.categoryRepository.query('DELETE FROM ads');
      console.log('Annonces supprimées');
      
      await this.categoryRepository.query('DELETE FROM subcategories');
      console.log('Sous-catégories supprimées');
      
      await this.categoryRepository.query('DELETE FROM categories');
      console.log('Anciennes catégories supprimées');
      
      // Réactiver les contraintes de clés étrangères
      await this.categoryRepository.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.log('Erreur lors de la suppression:', error.message);
      // Réactiver les contraintes même en cas d'erreur
      await this.categoryRepository.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    const categories = [
      {
        name: 'Immobilier',
        description: 'Biens immobiliers à louer',
      },
      {
        name: 'Véhicules',
        description: 'Véhicules de location',
      },
      {
        name: 'Electroménager',
        description: 'Appareils électroménagers',
      },
      {
        name: 'Evènementiel',
        description: 'Matériel pour événements',
      },
      {
        name: 'Professionnel',
        description: 'Matériel professionnel',
      },
      {
        name: 'Loisirs',
        description: 'Équipements de loisirs',
      },
    ];

    for (const categoryData of categories) {
      const category = this.categoryRepository.create(categoryData);
      await this.categoryRepository.save(category);
      console.log(`Catégorie ${categoryData.name} créée avec succès`);
    }
  }
}