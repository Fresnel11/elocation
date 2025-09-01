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
exports.SubCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const subcategories_service_1 = require("./subcategories.service");
let SubCategoriesController = class SubCategoriesController {
    constructor(subCategoriesService) {
        this.subCategoriesService = subCategoriesService;
    }
    async findByCategory(categoryId) {
        if (categoryId) {
            return this.subCategoriesService.findByCategory(categoryId);
        }
        return this.subCategoriesService.findAll();
    }
};
exports.SubCategoriesController = SubCategoriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubCategoriesController.prototype, "findByCategory", null);
exports.SubCategoriesController = SubCategoriesController = __decorate([
    (0, common_1.Controller)('subcategories'),
    __metadata("design:paramtypes", [subcategories_service_1.SubCategoriesService])
], SubCategoriesController);
//# sourceMappingURL=subcategories.controller.js.map