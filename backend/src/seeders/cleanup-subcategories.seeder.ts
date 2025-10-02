import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../subcategories/entities/subcategory.entity';

@Injectable()
export class CleanupSubCategoriesSeeder {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async cleanup() {
    console.log('Nettoyage des sous-catégories dupliquées...');

    // Récupérer toutes les sous-catégories
    const allSubCategories = await this.subCategoryRepository.find({
      relations: ['category']
    });

    // Grouper par nom + categoryId
    const grouped = allSubCategories.reduce((acc, subCat) => {
      const key = `${subCat.name}-${subCat.categoryId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(subCat);
      return acc;
    }, {} as Record<string, SubCategory[]>);

    // Supprimer les doublons (garder le plus ancien)
    let deletedCount = 0;
    for (const [key, duplicates] of Object.entries(grouped)) {
      if (duplicates.length > 1) {
        // Trier par date de création (garder le plus ancien)
        duplicates.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        
        // Supprimer tous sauf le premier
        const toDelete = duplicates.slice(1);
        for (const duplicate of toDelete) {
          await this.subCategoryRepository.remove(duplicate);
          console.log(`Supprimé: ${duplicate.name} (${duplicate.category?.name})`);
          deletedCount++;
        }
      }
    }

    console.log(`Nettoyage terminé. ${deletedCount} doublons supprimés.`);
  }
}