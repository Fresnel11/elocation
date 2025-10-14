export class LocationService {
  // Hiérarchie des villes du Bénin par proximité
  private static readonly CITY_HIERARCHY = {
    'Cotonou': ['Porto-Novo', 'Calavi', 'Abomey-Calavi', 'Ouidah'],
    'Porto-Novo': ['Cotonou', 'Calavi', 'Abomey-Calavi'],
    'Calavi': ['Cotonou', 'Abomey-Calavi', 'Porto-Novo'],
    'Abomey-Calavi': ['Calavi', 'Cotonou', 'Porto-Novo'],
    'Parakou': ['Bohicon', 'Djougou', 'Kandi'],
    'Bohicon': ['Parakou', 'Abomey', 'Cotonou'],
    'Ouidah': ['Cotonou', 'Calavi', 'Porto-Novo']
  };

  static getUserCityFromIP(ip: string): string | null {
    // Implémentation basique - à améliorer avec un service de géolocalisation IP
    return null;
  }

  static getNearbyCities(userCity: string): string[] {
    return this.CITY_HIERARCHY[userCity] || [];
  }

  static calculateCityPriority(userCity: string, adCity: string): number {
    if (userCity === adCity) return 1; // Même ville = priorité max
    
    const nearbyCities = this.getNearbyCities(userCity);
    const index = nearbyCities.indexOf(adCity);
    
    if (index !== -1) {
      return 1 - (index + 1) * 0.2; // Décroissance selon la proximité
    }
    
    return 0.1; // Autres villes = priorité minimale
  }
}