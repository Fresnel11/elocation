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
    const categories = [
      {
        name: 'Appartement',
        description: 'Appartements meublés ou non meublés',
      },
      {
        name: 'Maison',
        description: 'Maisons individuelles à louer',
      },
      {
        name: 'Studio',
        description: 'Studios et petits espaces',
      },
      {
        name: 'Villa',
        description: 'Villas de luxe avec jardin',
      },
      {
        name: 'Chambre',
        description: 'Chambres individuelles en colocation',
      },
      {
        name: 'Bureau',
        description: 'Espaces de bureau et commerciaux',
      },
    ];

    for (const categoryData of categories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryData.name },
      });

      if (!existingCategory) {
        const category = this.categoryRepository.create(categoryData);
        await this.categoryRepository.save(category);
        console.log(`Catégorie ${categoryData.name} créée avec succès`);
      }
    }
  }
}