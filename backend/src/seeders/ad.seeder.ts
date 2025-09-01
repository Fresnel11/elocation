import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from '../ads/entities/ad.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AdSeeder {
  constructor(
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    // Les annonces ont déjà été supprimées par le seeder des catégories
    console.log('Création des nouvelles annonces...');

    const users = await this.userRepository.find({ 
      relations: ['role'],
      where: { role: { name: UserRole.OWNER } }
    });
    const categories = await this.categoryRepository.find();

    if (users.length === 0 || categories.length === 0) {
      console.log('Aucun propriétaire ou catégorie trouvé, seeding des annonces ignoré');
      return;
    }

    const locations = ['Cotonou, Littoral', 'Calavi, Atlantique', 'Abomey-Calavi, Atlantique', 'Porto-Novo, Ouémé', 'Parakou, Borgou'];
    const amenitiesList = ['wifi', 'tv', 'ac', 'kitchen', 'parking', 'security', 'garden', 'pool'];

    const adsData = [
      {
        title: 'Appartement moderne 2 chambres - Cotonou Centre',
        description: 'Magnifique appartement entièrement meublé avec vue sur la ville. Proche des commodités.',
        price: 85000,
        bedrooms: 2,
        bathrooms: 1,
        area: 65,
        amenities: ['wifi', 'tv', 'ac', 'kitchen'],
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop']
      },
      {
        title: 'Villa spacieuse 4 chambres avec jardin',
        description: 'Belle villa familiale dans un quartier calme et sécurisé avec grand jardin.',
        price: 150000,
        bedrooms: 4,
        bathrooms: 3,
        area: 120,
        amenities: ['wifi', 'tv', 'ac', 'kitchen', 'parking', 'garden'],
        photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop']
      },
      {
        title: 'Studio moderne proche université',
        description: 'Studio parfait pour étudiant, entièrement équipé et proche des transports.',
        price: 45000,
        bedrooms: 1,
        bathrooms: 1,
        area: 25,
        amenities: ['wifi', 'tv', 'kitchen'],
        photos: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop']
      },
      {
        title: 'Maison 3 chambres avec cour',
        description: 'Maison traditionnelle avec cour spacieuse, idéale pour famille.',
        price: 95000,
        bedrooms: 3,
        bathrooms: 2,
        area: 85,
        amenities: ['wifi', 'tv', 'kitchen', 'parking'],
        photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop']
      },
      {
        title: 'Chambre meublée en colocation',
        description: 'Chambre confortable dans maison partagée avec étudiants.',
        price: 25000,
        bedrooms: 1,
        bathrooms: 1,
        area: 15,
        amenities: ['wifi', 'tv'],
        photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop']
      },
      {
        title: 'Bureau moderne centre-ville',
        description: 'Espace de bureau moderne avec climatisation et parking.',
        price: 120000,
        bedrooms: 0,
        bathrooms: 2,
        area: 50,
        amenities: ['wifi', 'ac', 'parking', 'security'],
        photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop']
      },
      {
        title: 'Appartement 1 chambre meublé',
        description: 'Petit appartement cosy, parfait pour jeune couple.',
        price: 65000,
        bedrooms: 1,
        bathrooms: 1,
        area: 40,
        amenities: ['wifi', 'tv', 'ac', 'kitchen'],
        photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop']
      },
      {
        title: 'Villa de luxe avec piscine',
        description: 'Villa haut de gamme avec piscine et jardin paysager.',
        price: 250000,
        bedrooms: 5,
        bathrooms: 4,
        area: 200,
        amenities: ['wifi', 'tv', 'ac', 'kitchen', 'parking', 'garden', 'pool', 'security'],
        photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop']
      },
      {
        title: 'Studio étudiant équipé',
        description: 'Studio moderne avec kitchenette, proche campus universitaire.',
        price: 40000,
        bedrooms: 1,
        bathrooms: 1,
        area: 20,
        amenities: ['wifi', 'tv', 'kitchen'],
        photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop']
      },
      {
        title: 'Maison familiale 4 chambres',
        description: 'Grande maison familiale avec jardin et garage.',
        price: 110000,
        bedrooms: 4,
        bathrooms: 2,
        area: 100,
        amenities: ['wifi', 'tv', 'kitchen', 'parking', 'garden'],
        photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop']
      },
      {
        title: 'Appartement 3 chambres standing',
        description: 'Appartement haut standing avec balcon et vue dégagée.',
        price: 125000,
        bedrooms: 3,
        bathrooms: 2,
        area: 90,
        amenities: ['wifi', 'tv', 'ac', 'kitchen', 'parking'],
        photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop']
      },
      {
        title: 'Chambre simple meublée',
        description: 'Chambre simple dans quartier calme, idéale pour étudiant.',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
        area: 12,
        amenities: ['wifi'],
        photos: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop']
      },
      {
        title: 'Bureau partagé moderne',
        description: 'Espace de coworking moderne avec toutes commodités.',
        price: 80000,
        bedrooms: 0,
        bathrooms: 1,
        area: 30,
        amenities: ['wifi', 'ac', 'security'],
        photos: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop']
      },
      {
        title: 'Villa 3 chambres avec piscine',
        description: 'Villa moderne avec piscine privée et jardin tropical.',
        price: 180000,
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        amenities: ['wifi', 'tv', 'ac', 'kitchen', 'parking', 'garden', 'pool'],
        photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop']
      },
      {
        title: 'Studio design centre-ville',
        description: 'Studio au design moderne en plein centre-ville.',
        price: 55000,
        bedrooms: 1,
        bathrooms: 1,
        area: 30,
        amenities: ['wifi', 'tv', 'ac', 'kitchen'],
        photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop']
      },
      {
        title: 'Maison 2 chambres avec jardin',
        description: 'Maison confortable avec petit jardin et terrasse.',
        price: 75000,
        bedrooms: 2,
        bathrooms: 1,
        area: 60,
        amenities: ['wifi', 'tv', 'kitchen', 'garden'],
        photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop']
      },
      {
        title: 'Appartement duplex 4 chambres',
        description: 'Duplex spacieux avec terrasse et vue panoramique.',
        price: 160000,
        bedrooms: 4,
        bathrooms: 3,
        area: 130,
        amenities: ['wifi', 'tv', 'ac', 'kitchen', 'parking'],
        photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop']
      },
      {
        title: 'Chambre VIP meublée',
        description: 'Chambre haut de gamme avec salle de bain privée.',
        price: 35000,
        bedrooms: 1,
        bathrooms: 1,
        area: 20,
        amenities: ['wifi', 'tv', 'ac'],
        photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop']
      },
      {
        title: 'Local commercial équipé',
        description: 'Local commercial avec vitrine, idéal pour boutique.',
        price: 200000,
        bedrooms: 0,
        bathrooms: 1,
        area: 80,
        amenities: ['wifi', 'ac', 'security'],
        photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop']
      },
      {
        title: 'Villa familiale 6 chambres',
        description: 'Grande villa familiale avec piscine et grand jardin.',
        price: 300000,
        bedrooms: 6,
        bathrooms: 4,
        area: 250,
        amenities: ['wifi', 'tv', 'ac', 'kitchen', 'parking', 'garden', 'pool', 'security'],
        photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop']
      }
    ];

    const categoryMap = {
      'Appartement': ['Appartement moderne 2 chambres', 'Appartement 1 chambre meublé', 'Appartement 3 chambres standing', 'Appartement duplex 4 chambres'],
      'Villa': ['Villa spacieuse 4 chambres', 'Villa de luxe avec piscine', 'Villa 3 chambres avec piscine', 'Villa familiale 6 chambres'],
      'Studio': ['Studio moderne proche université', 'Studio étudiant équipé', 'Studio design centre-ville'],
      'Maison': ['Maison 3 chambres avec cour', 'Maison familiale 4 chambres', 'Maison 2 chambres avec jardin'],
      'Chambre': ['Chambre meublée en colocation', 'Chambre simple meublée', 'Chambre VIP meublée'],
      'Bureau': ['Bureau moderne centre-ville', 'Bureau partagé moderne', 'Local commercial équipé']
    };

    for (let i = 0; i < adsData.length; i++) {
      const adData = adsData[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      let selectedCategory = categories[0];
      for (const [categoryName, titles] of Object.entries(categoryMap)) {
        if (titles.some(title => adData.title.includes(title.split(' ')[0]))) {
          selectedCategory = categories.find(cat => cat.name === categoryName) || categories[0];
          break;
        }
      }

      const ad = this.adRepository.create({
        ...adData,
        location: randomLocation,
        userId: randomUser.id,
        categoryId: selectedCategory.id,
        whatsappNumber: `+229${Math.floor(Math.random() * 90000000) + 10000000}`,
      });

      await this.adRepository.save(ad);
    }

    console.log('20 annonces créées avec succès');
  }
}