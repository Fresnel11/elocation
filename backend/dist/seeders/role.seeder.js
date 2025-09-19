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
exports.RoleSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../roles/entities/role.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let RoleSeeder = class RoleSeeder {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async seed() {
        const roles = [
            {
                name: user_role_enum_1.UserRole.ADMIN,
                description: 'Administrateur système avec tous les privilèges',
            },
            {
                name: user_role_enum_1.UserRole.USER,
                description: 'Utilisateur standard',
            },
        ];
        for (const roleData of roles) {
            const existingRole = await this.roleRepository.findOne({
                where: { name: roleData.name },
            });
            if (!existingRole) {
                const role = this.roleRepository.create(roleData);
                await this.roleRepository.save(role);
                console.log(`Rôle ${roleData.name} créé avec succès`);
            }
        }
    }
};
exports.RoleSeeder = RoleSeeder;
exports.RoleSeeder = RoleSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoleSeeder);
//# sourceMappingURL=role.seeder.js.map