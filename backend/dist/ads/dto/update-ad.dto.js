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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateAdDto {
}
exports.UpdateAdDto = UpdateAdDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Titre de l\'annonce',
        example: 'Appartement 3 pièces à vendre',
        minLength: 10,
        maxLength: 100,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateAdDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description détaillée de l\'annonce',
        example: 'Bel appartement avec balcon, cuisine équipée, 2 chambres, salon, salle de bain complète.',
        minLength: 20,
        maxLength: 1000,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateAdDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix en FCFA',
        example: 25000000,
        minimum: 1000,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], UpdateAdDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Localisation de l\'annonce',
        example: 'Lomé, Togo - Quartier Akodessewa',
        minLength: 5,
        maxLength: 200,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateAdDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro WhatsApp pour contact (format international)',
        example: '+22999154678',
        pattern: '^\\+[1-9]\\d{1,14}$',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(15),
    __metadata("design:type", String)
], UpdateAdDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la catégorie',
        example: 'uuid-category-id',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateAdDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la sous-catégorie',
        example: 'uuid-subcategory-id',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'subCategoryId must be a valid UUID' }),
    __metadata("design:type", String)
], UpdateAdDto.prototype, "subCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de chambres',
        example: 2,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAdDto.prototype, "bedrooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de salles de bain',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateAdDto.prototype, "bathrooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Surface en m²',
        example: 65,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateAdDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des équipements disponibles',
        example: ['wifi', 'tv', 'ac', 'kitchen'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateAdDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URLs des photos',
        example: ['photo1.jpg', 'photo2.jpg'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateAdDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la vidéo',
        example: 'video.mp4',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdDto.prototype, "video", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Latitude de l\'annonce',
        example: 6.3703,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAdDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Longitude de l\'annonce',
        example: 2.3912,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAdDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Annonce disponible à la vente/location',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAdDto.prototype, "isAvailable", void 0);
//# sourceMappingURL=update-ad.dto.js.map