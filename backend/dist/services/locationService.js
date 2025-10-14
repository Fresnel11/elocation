"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
class LocationService {
    static getUserCityFromIP(ip) {
        return null;
    }
    static getNearbyCities(userCity) {
        return this.CITY_HIERARCHY[userCity] || [];
    }
    static calculateCityPriority(userCity, adCity) {
        if (userCity === adCity)
            return 1;
        const nearbyCities = this.getNearbyCities(userCity);
        const index = nearbyCities.indexOf(adCity);
        if (index !== -1) {
            return 1 - (index + 1) * 0.2;
        }
        return 0.1;
    }
}
exports.LocationService = LocationService;
LocationService.CITY_HIERARCHY = {
    'Cotonou': ['Porto-Novo', 'Calavi', 'Abomey-Calavi', 'Ouidah'],
    'Porto-Novo': ['Cotonou', 'Calavi', 'Abomey-Calavi'],
    'Calavi': ['Cotonou', 'Abomey-Calavi', 'Porto-Novo'],
    'Abomey-Calavi': ['Calavi', 'Cotonou', 'Porto-Novo'],
    'Parakou': ['Bohicon', 'Djougou', 'Kandi'],
    'Bohicon': ['Parakou', 'Abomey', 'Cotonou'],
    'Ouidah': ['Cotonou', 'Calavi', 'Porto-Novo']
};
//# sourceMappingURL=locationService.js.map