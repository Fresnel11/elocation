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
      // Supprimer d'abord les reviews pour éviter les contraintes FK
      await this.categoryRepository.query('DELETE FROM reviews');
      console.log('Reviews supprimées');
      
      // Supprimer les annonces
      await this.categoryRepository.query('DELETE FROM ads');
      console.log('Annonces supprimées');
    } catch (error) {
      console.log('Erreur lors de la suppression, continuons...');
    }
    
    // Supprimer les sous-catégories avant les catégories
    await this.categoryRepository.query('DELETE FROM subcategories');
    console.log('Sous-catégories supprimées');
    
    // Supprimer toutes les anciennes catégories
    await this.categoryRepository.query('DELETE FROM categories');
    console.log('Anciennes catégories supprimées');

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