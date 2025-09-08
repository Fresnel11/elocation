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
    constructor() {
        this.cities = new Map([
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
    }
    extractCoordinates(location) {
        if (!location)
            return null;
        const normalizedLocation = location.toLowerCase()
            .replace(/[,\-\s]+/g, '-')
            .replace(/^-+|-+$/g, '');
        if (this.cities.has(normalizedLocation)) {
            return this.cities.get(normalizedLocation);
        }
        for (const [cityKey, coords] of this.cities.entries()) {
            if (normalizedLocation.includes(cityKey) || cityKey.includes(normalizedLocation)) {
                return coords;
            }
        }
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
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)()
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map