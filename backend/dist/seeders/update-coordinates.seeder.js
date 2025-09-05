"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCoordinatesSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ad_entity_1 = require("../ads/entities/ad.entity");
let UpdateCoordinatesSeeder = class UpdateCoordinatesSeeder {
    constructor(adRepository) {
        this.adRepository = adRepository;
        this.cityCoordinates = {
            'cotonou': { lat: 6.3703, lng: 2.3912 },
            'porto-novo': { lat: 6.4969, lng: 2.6283 },
            'parakou': { lat: 9.3372, lng: 2.6303 },
            'abomey-calavi': { lat: 6.4489, lng: 2.3556 },
            'bohicon': { lat: 7.1781, lng: 2.0667 },
            'calavi': { lat: 6.4489, lng: 2.3556 },
        };
    }
    async updateCoordinates() {
        const ads = await this.adRepository.find({
            where: [
                { latitude: (0, typeorm_2.IsNull)() },
                { longitude: (0, typeorm_2.IsNull)() }
            ]
        });
        for (const ad of ads) {
            const location = ad.location.toLowerCase();
            for (const [city, coords] of Object.entries(this.cityCoordinates)) {
                if (location.includes(city)) {
                    const latVariation = (Math.random() - 0.5) * 0.02;
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
};
exports.UpdateCoordinatesSeeder = UpdateCoordinatesSeeder;
exports.UpdateCoordinatesSeeder = UpdateCoordinatesSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateCoordinatesSeeder);
//# sourceMappingURL=update-coordinates.seeder.js.map