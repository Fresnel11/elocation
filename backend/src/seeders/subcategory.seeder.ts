import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class SubCategorySeeder {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    // Les sous-catégories ont déjà été supprimées par le seeder des catégories
    console.log('Création des nouvelles sous-catégories...');

    const categories = await this.categoryRepository.find();
    const categoryMap = categories.reduce((map, cat) => {
      map[cat.name] = cat.id;
      return map;
    }, {} as Record<string, string>);

    const subCategories = [
      // Immobilier
      { name: 'Appartement', description: 'Appartements meublés ou non meublés', categoryName: 'Immobilier' },
      { name: 'Maison', description: 'Maisons individuelles à louer', categoryName: 'Immobilier' },
      { name: 'Studio', description: 'Studios et petits espaces', categoryName: 'Immobilier' },
      { name: 'Villa', description: 'Villas de luxe avec jardin', categoryName: 'Immobilier' },
      { name: 'Chambre', description: 'Chambres individuelles en colocation', categoryName: 'Immobilier' },
      { name: 'Bureau', description: 'Espaces de bureau et commerciaux', categoryName: 'Immobilier' },
      { name: 'Magasin', description: 'Locaux commerciaux', categoryName: 'Immobilier' },
      
      // Véhicules
      { name: 'Voiture', description: 'Voitures de location', categoryName: 'Véhicules' },
      { name: 'Moto', description: 'Motos et scooters', categoryName: 'Véhicules' },
      { name: 'Camion', description: 'Camions et utilitaires', categoryName: 'Véhicules' },
      { name: 'Bus', description: 'Autobus et minibus', categoryName: 'Véhicules' },
      
      // Electroménager
      { name: 'Réfrigérateur', description: 'Réfrigérateurs et congélateurs', categoryName: 'Electroménager' },
      { name: 'Lave-linge', description: 'Machines à laver', categoryName: 'Electroménager' },
      { name: 'Climatiseur', description: 'Climatiseurs et ventilateurs', categoryName: 'Electroménager' },
      { name: 'Télévision', description: 'Téléviseurs et écrans', categoryName: 'Electroménager' },
      { name: 'Micro-onde', description: 'Fours micro-ondes', categoryName: 'Electroménager' },
      
      // Evènementiel
      { name: 'Sonorisation', description: 'Matériel audio et sonorisation', categoryName: 'Evènementiel' },
      { name: 'Éclairage', description: 'Éclairage pour événements', categoryName: 'Evènementiel' },
      { name: 'Mobilier', description: 'Tables, chaises, décoration', categoryName: 'Evènementiel' },
      { name: 'Tente', description: 'Tentes et barnums', categoryName: 'Evènementiel' },
      
      // Professionnel
      { name: 'Ordinateur', description: 'Ordinateurs et laptops', categoryName: 'Professionnel' },
      { name: 'Imprimante', description: 'Imprimantes et scanners', categoryName: 'Professionnel' },
      { name: 'Projecteur', description: 'Projecteurs et écrans', categoryName: 'Professionnel' },
      { name: 'Outillage', description: 'Outils professionnels', categoryName: 'Professionnel' },
      
      // Loisirs
      { name: 'Sport', description: 'Équipements sportifs', categoryName: 'Loisirs' },
      { name: 'Jeux', description: 'Jeux et divertissements', categoryName: 'Loisirs' },
      { name: 'Camping', description: 'Matériel de camping', categoryName: 'Loisirs' },
      { name: 'Musique', description: 'Instruments de musique', categoryName: 'Loisirs' },
    ];

    for (const subCatData of subCategories) {
      const categoryId = categoryMap[subCatData.categoryName];
      if (categoryId) {
        // Vérifier si la sous-catégorie existe déjà
        const existingSubCategory = await this.subCategoryRepository.findOne({
          where: { 
            name: subCatData.name, 
            categoryId: categoryId 
          }
        });

        if (!existingSubCategory) {
          const subCategory = this.subCategoryRepository.create({
            name: subCatData.name,
            description: subCatData.description,
            categoryId: categoryId,
          });
          await this.subCategoryRepository.save(subCategory);
          console.log(`Sous-catégorie ${subCatData.name} créée avec succès`);
        } else {
          console.log(`Sous-catégorie ${subCatData.name} existe déjà, ignorée`);
        }
      }
    }
  }
}