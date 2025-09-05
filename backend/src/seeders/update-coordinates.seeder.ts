import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Ad } from '../ads/entities/ad.entity';

@Injectable()
export class UpdateCoordinatesSeeder {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
  ) {}

  private readonly cityCoordinates = {
    'cotonou': { lat: 6.3703, lng: 2.3912 },
    'porto-novo': { lat: 6.4969, lng: 2.6283 },
    'parakou': { lat: 9.3372, lng: 2.6303 },
    'abomey-calavi': { lat: 6.4489, lng: 2.3556 },
    'bohicon': { lat: 7.1781, lng: 2.0667 },
    'calavi': { lat: 6.4489, lng: 2.3556 },
  };

  async updateCoordinates(): Promise<void> {
    const ads = await this.adRepository.find({
      where: [
        { latitude: IsNull() },
        { longitude: IsNull() }
      ]
    });

    for (const ad of ads) {
      const location = ad.location.toLowerCase();
      
      // Chercher une ville correspondante
      for (const [city, coords] of Object.entries(this.cityCoordinates)) {
        if (location.includes(city)) {
          // Ajouter une petite variation aléatoire pour éviter que toutes les annonces aient exactement les mêmes coordonnées
          const latVariation = (Math.random() - 0.5) * 0.02; // ±0.01 degré (~1km)
          const lngVariation = (Math.random() - 0.5) * 0.02;
          
          ad.latitude = coords.lat + latVariation;
          ad.longitude = coords.lng + lngVariation;
          
          await this.adRepository.save(ad);
          console.log(`Coordonnées mises à jour pour l'annonce ${ad.id} (${ad.location})`);
          break;
        }
      }
    }
    
    console.log('Mise à jour des coordonnées terminée');
  }
}