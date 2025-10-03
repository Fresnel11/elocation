"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_entity_1 = require("../roles/entities/role.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const subcategory_entity_1 = require("../subcategories/entities/subcategory.entity");
const ad_entity_1 = require("../ads/entities/ad.entity");
const user_entity_1 = require("../users/entities/user.entity");
const role_seeder_1 = require("./role.seeder");
const category_seeder_1 = require("./category.seeder");
const subcategory_seeder_1 = require("./subcategory.seeder");
const cleanup_subcategories_seeder_1 = require("./cleanup-subcategories.seeder");
const user_seeder_1 = require("./user.seeder");
const ad_seeder_1 = require("./ad.seeder");
const seeder_service_1 = require("./seeder.service");
const init_data_controller_1 = require("./init-data.controller");
const update_coordinates_seeder_1 = require("./update-coordinates.seeder");
const permission_seeder_1 = require("./permission.seeder");
const role_permission_seeder_1 = require("./role-permission.seeder");
const permission_entity_1 = require("../permissions/entities/permission.entity");
let SeederModule = class SeederModule {
};
exports.SeederModule = SeederModule;
exports.SeederModule = SeederModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role, category_entity_1.Category, subcategory_entity_1.SubCategory, ad_entity_1.Ad, user_entity_1.User, permission_entity_1.Permission])],
        controllers: [init_data_controller_1.InitDataController],
        providers: [role_seeder_1.RoleSeeder, category_seeder_1.CategorySeeder, subcategory_seeder_1.SubCategorySeeder, cleanup_subcategories_seeder_1.CleanupSubCategoriesSeeder, user_seeder_1.UserSeeder, ad_seeder_1.AdSeeder, permission_seeder_1.PermissionSeeder, role_permission_seeder_1.RolePermissionSeeder, seeder_service_1.SeederService, update_coordinates_seeder_1.UpdateCoordinatesSeeder],
        exports: [seeder_service_1.SeederService, update_coordinates_seeder_1.UpdateCoordinatesSeeder],
    })
], SeederModule);
//# sourceMappingURL=seeder.module.js.map