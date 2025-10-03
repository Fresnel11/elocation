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
exports.RolePermissionSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../roles/entities/role.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let RolePermissionSeeder = class RolePermissionSeeder {
    constructor(roleRepository, permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async seed() {
        var _a;
        const superAdminRole = await this.roleRepository.findOne({
            where: { name: user_role_enum_1.UserRole.SUPER_ADMIN },
            relations: ['permissions']
        });
        if (!superAdminRole) {
            console.log('Rôle SUPER_ADMIN non trouvé');
            return;
        }
        const systemPermissions = await this.permissionRepository.find({
            where: { isSystemPermission: true }
        });
        if (systemPermissions.length === 0) {
            console.log('Aucune permission système trouvée');
            return;
        }
        const existingPermissionIds = ((_a = superAdminRole.permissions) === null || _a === void 0 ? void 0 : _a.map(p => p.id)) || [];
        const newPermissions = systemPermissions.filter(p => !existingPermissionIds.includes(p.id));
        if (newPermissions.length > 0) {
            superAdminRole.permissions = [...(superAdminRole.permissions || []), ...newPermissions];
            await this.roleRepository.save(superAdminRole);
            console.log(`${newPermissions.length} permissions attribuées au SUPER_ADMIN`);
        }
        else {
            console.log('SUPER_ADMIN a déjà toutes les permissions système');
        }
    }
};
exports.RolePermissionSeeder = RolePermissionSeeder;
exports.RolePermissionSeeder = RolePermissionSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolePermissionSeeder);
//# sourceMappingURL=role-permission.seeder.js.map