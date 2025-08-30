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
exports.UserSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const bcrypt = require("bcrypt");
let UserSeeder = class UserSeeder {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    async seed() {
        const existingTestUser = await this.userRepository.findOne({ where: { email: 'marie.adjovi@example.com' } });
        if (existingTestUser) {
            console.log('Les utilisateurs de test existent déjà, seeding ignoré');
            return;
        }
        const ownerRole = await this.roleRepository.findOne({ where: { name: user_role_enum_1.UserRole.OWNER } });
        const tenantRole = await this.roleRepository.findOne({ where: { name: user_role_enum_1.UserRole.TENANT } });
        if (!ownerRole || !tenantRole) {
            console.log('Rôles non trouvés, seeding des utilisateurs ignoré');
            return;
        }
        const usersData = [
            {
                firstName: 'Marie',
                lastName: 'Adjovi',
                email: 'marie.adjovi@example.com',
                phone: '+22997123456',
                password: await bcrypt.hash('password123', 10),
                role: ownerRole,
                isVerified: true,
            },
            {
                firstName: 'Jean',
                lastName: 'Koudjo',
                email: 'jean.koudjo@example.com',
                phone: '+22997234567',
                password: await bcrypt.hash('password123', 10),
                role: ownerRole,
                isVerified: true,
            },
            {
                firstName: 'Fatou',
                lastName: 'Sanni',
                email: 'fatou.sanni@example.com',
                phone: '+22997345678',
                password: await bcrypt.hash('password123', 10),
                role: ownerRole,
                isVerified: true,
            },
            {
                firstName: 'Pierre',
                lastName: 'Dossou',
                email: 'pierre.dossou@example.com',
                phone: '+22997456789',
                password: await bcrypt.hash('password123', 10),
                role: ownerRole,
                isVerified: true,
            },
            {
                firstName: 'Aminata',
                lastName: 'Traore',
                email: 'aminata.traore@example.com',
                phone: '+22997567890',
                password: await bcrypt.hash('password123', 10),
                role: tenantRole,
                isVerified: true,
            },
        ];
        for (const userData of usersData) {
            const user = this.userRepository.create(userData);
            await this.userRepository.save(user);
            console.log(`Utilisateur ${userData.firstName} ${userData.lastName} créé avec succès`);
        }
    }
};
exports.UserSeeder = UserSeeder;
exports.UserSeeder = UserSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserSeeder);
//# sourceMappingURL=user.seeder.js.map