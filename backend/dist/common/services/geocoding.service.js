"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
let GeocodingService = class GeocodingService {
    async geocodeAddress(address) {
        try {
            const locations = this.getBeninLocations();
            const normalizedAddress = address.toLowerCase().trim();
            for (const [key, location] of Object.entries(locations)) {
                if (normalizedAddress.includes(key)) {
                    return {
                        coordinates: location.coordinates,
                        formattedAddress: location.name,
                        city: location.name,
                        country: 'Bénin'
                    };
                }
            }
            return {
                coordinates: { latitude: 6.3703, longitude: 2.3912 },
                formattedAddress: address,
                city: 'Cotonou',
                country: 'Bénin'
            };
        }
        catch (error) {
            console.error('Erreur de géocodage:', error);
            return null;
        }
    }
    async reverseGeocode(latitude, longitude) {
        try {
            const locations = this.getBeninLocations();
            let closestCity = 'Cotonou';
            let minDistance = Infinity;
            for (const [key, location] of Object.entries(locations)) {
                const distance = this.calculateDistance(latitude, longitude, location.coordinates.latitude, location.coordinates.longitude);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCity = location.name;
                }
            }
            return closestCity;
        }
        catch (error) {
            console.error('Erreur de géocodage inverse:', error);
            return 'Localisation inconnue';
        }
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    getBeninLocations() {
        return {
            'cotonou': {
                name: 'Cotonou',
                coordinates: { latitude: 6.3703, longitude: 2.3912 }
            },
            'porto-novo': {
                name: 'Porto-Novo',
                coordinates: { latitude: 6.4969, longitude: 2.6283 }
            },
            'parakou': {
                name: 'Parakou',
                coordinates: { latitude: 9.3372, longitude: 2.6303 }
            },
            'abomey': {
                name: 'Abomey',
                coordinates: { latitude: 7.1826, longitude: 1.9913 }
            },
            'calavi': {
                name: 'Calavi',
                coordinates: { latitude: 6.4500, longitude: 2.3500 }
            },
            'bohicon': {
                name: 'Bohicon',
                coordinates: { latitude: 7.1667, longitude: 2.0667 }
            },
            'kandi': {
                name: 'Kandi',
                coordinates: { latitude: 11.1342, longitude: 2.9386 }
            },
            'ouidah': {
                name: 'Ouidah',
                coordinates: { latitude: 6.3622, longitude: 2.0856 }
            },
            'djougou': {
                name: 'Djougou',
                coordinates: { latitude: 9.7086, longitude: 1.6658 }
            },
            'lokossa': {
                name: 'Lokossa',
                coordinates: { latitude: 6.6389, longitude: 1.7167 }
            }
        };
    }
    async findNearbyAds(latitude, longitude, radiusKm = 10) {
        return {
            minLatitude: latitude - (radiusKm / 111),
            maxLatitude: latitude + (radiusKm / 111),
            minLongitude: longitude - (radiusKm / (111 * Math.cos(latitude * Math.PI / 180))),
            maxLongitude: longitude + (radiusKm / (111 * Math.cos(latitude * Math.PI / 180)))
        };
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)()
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map