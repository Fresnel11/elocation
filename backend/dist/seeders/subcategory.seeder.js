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
exports.SubCategorySeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subcategory_entity_1 = require("../subcategories/entities/subcategory.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let SubCategorySeeder = class SubCategorySeeder {
    constructor(subCategoryRepository, categoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
        this.categoryRepository = categoryRepository;
    }
    async seed() {
        console.log('Création des nouvelles sous-catégories...');
        const categories = await this.categoryRepository.find();
        const categoryMap = categories.reduce((map, cat) => {
            map[cat.name] = cat.id;
            return map;
        }, {});
        const subCategories = [
            { name: 'Appartement', description: 'Appartements meublés ou non meublés', categoryName: 'Immobilier' },
            { name: 'Maison', description: 'Maisons individuelles à louer', categoryName: 'Immobilier' },
            { name: 'Studio', description: 'Studios et petits espaces', categoryName: 'Immobilier' },
            { name: 'Villa', description: 'Villas de luxe avec jardin', categoryName: 'Immobilier' },
            { name: 'Chambre', description: 'Chambres individuelles en colocation', categoryName: 'Immobilier' },
            { name: 'Bureau', description: 'Espaces de bureau et commerciaux', categoryName: 'Immobilier' },
            { name: 'Magasin', description: 'Locaux commerciaux', categoryName: 'Immobilier' },
            { name: 'Voiture', description: 'Voitures de location', categoryName: 'Véhicules' },
            { name: 'Moto', description: 'Motos et scooters', categoryName: 'Véhicules' },
            { name: 'Camion', description: 'Camions et utilitaires', categoryName: 'Véhicules' },
            { name: 'Bus', description: 'Autobus et minibus', categoryName: 'Véhicules' },
            { name: 'Réfrigérateur', description: 'Réfrigérateurs et congélateurs', categoryName: 'Electroménager' },
            { name: 'Lave-linge', description: 'Machines à laver', categoryName: 'Electroménager' },
            { name: 'Climatiseur', description: 'Climatiseurs et ventilateurs', categoryName: 'Electroménager' },
            { name: 'Télévision', description: 'Téléviseurs et écrans', categoryName: 'Electroménager' },
            { name: 'Micro-onde', description: 'Fours micro-ondes', categoryName: 'Electroménager' },
            { name: 'Sonorisation', description: 'Matériel audio et sonorisation', categoryName: 'Evènementiel' },
            { name: 'Éclairage', description: 'Éclairage pour événements', categoryName: 'Evènementiel' },
            { name: 'Mobilier', description: 'Tables, chaises, décoration', categoryName: 'Evènementiel' },
            { name: 'Tente', description: 'Tentes et barnums', categoryName: 'Evènementiel' },
            { name: 'Ordinateur', description: 'Ordinateurs et laptops', categoryName: 'Professionnel' },
            { name: 'Imprimante', description: 'Imprimantes et scanners', categoryName: 'Professionnel' },
            { name: 'Projecteur', description: 'Projecteurs et écrans', categoryName: 'Professionnel' },
            { name: 'Outillage', description: 'Outils professionnels', categoryName: 'Professionnel' },
            { name: 'Sport', description: 'Équipements sportifs', categoryName: 'Loisirs' },
            { name: 'Jeux', description: 'Jeux et divertissements', categoryName: 'Loisirs' },
            { name: 'Camping', description: 'Matériel de camping', categoryName: 'Loisirs' },
            { name: 'Musique', description: 'Instruments de musique', categoryName: 'Loisirs' },
        ];
        for (const subCatData of subCategories) {
            const categoryId = categoryMap[subCatData.categoryName];
            if (categoryId) {
                const subCategory = this.subCategoryRepository.create({
                    name: subCatData.name,
                    description: subCatData.description,
                    categoryId: categoryId,
                });
                await this.subCategoryRepository.save(subCategory);
                console.log(`Sous-catégorie ${subCatData.name} créée avec succès`);
            }
        }
    }
};
exports.SubCategorySeeder = SubCategorySeeder;
exports.SubCategorySeeder = SubCategorySeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubCategory)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubCategorySeeder);
//# sourceMappingURL=subcategory.seeder.js.map