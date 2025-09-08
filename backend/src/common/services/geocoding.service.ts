import { Injectable } from '@nestjs/common';

interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable()
export class GeocodingService {
  // Base de données des villes du Bénin avec coordonnées
  private readonly cities = new Map<string, Coordinates>([
    ['cotonou', { latitude: 6.3703, longitude: 2.3912 }],
    ['porto-novo', { latitude: 6.4969, longitude: 2.6283 }],
    ['parakou', { latitude: 9.3372, longitude: 2.6303 }],
    ['abomey-calavi', { latitude: 6.4489, longitude: 2.3556 }],
    ['bohicon', { latitude: 7.1781, longitude: 2.0667 }],
    ['natitingou', { latitude: 10.3042, longitude: 1.3794 }],
    ['kandi', { latitude: 11.1342, longitude: 2.9386 }],
    ['ouidah', { latitude: 6.3622, longitude: 2.0856 }],
    ['djougou', { latitude: 9.7086, longitude: 1.6658 }],
    ['lokossa', { latitude: 6.6389, longitude: 1.7167 }],
  ]);

  /**
   * Extrait les coordonnées d'une localisation textuelle
   */
  extractCoordinates(location: string): Coordinates | null {
    if (!location) return null;

    const normalizedLocation = location.toLowerCase()
      .replace(/[,\-\s]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Recherche exacte
    if (this.cities.has(normalizedLocation)) {
      return this.cities.get(normalizedLocation)!;
    }

    // Recherche partielle
    for (const [cityKey, coords] of this.cities.entries()) {
      if (normalizedLocation.includes(cityKey) || cityKey.includes(normalizedLocation)) {
        return coords;
      }
    }

    // Recherche par mots-clés
    const keywords = normalizedLocation.split('-');
    for (const keyword of keywords) {
      if (keyword.length >= 3) {
        for (const [cityKey, coords] of this.cities.entries()) {
          if (cityKey.includes(keyword)) {
            return coords;
          }
        }
      }
    }

    return null;
  }
}