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
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const role_seeder_1 = require("./role.seeder");
let SeederService = class SeederService {
    constructor(roleSeeder) {
        this.roleSeeder = roleSeeder;
    }
    async onModuleInit() {
        if (process.env.NODE_ENV === 'development') {
            await this.seedRoles();
        }
    }
    async seedRoles() {
        try {
            await this.roleSeeder.seed();
            console.log('Seeding des rôles terminé');
        }
        catch (error) {
            console.error('Erreur lors du seeding des rôles:', error);
        }
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_seeder_1.RoleSeeder])
], SeederService);
//# sourceMappingURL=seeder.service.js.map