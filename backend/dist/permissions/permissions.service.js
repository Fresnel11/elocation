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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("./entities/permission.entity");
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
let PermissionsService = class PermissionsService {
    constructor(permissionRepository, userRepository, roleRepository) {
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    async hasPermission(userId, permissionName) {
        var _a, _b, _c;
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role', 'role.permissions'],
        });
        if (!user)
            return false;
        if (((_a = user.role) === null || _a === void 0 ? void 0 : _a.name) === 'super_admin')
            return true;
        return ((_c = (_b = user.role) === null || _b === void 0 ? void 0 : _b.permissions) === null || _c === void 0 ? void 0 : _c.some(permission => permission.name === permissionName)) || false;
    }
    async grantPermissionToRole(roleId, permissionName) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });
        const permission = await this.permissionRepository.findOne({
            where: { name: permissionName },
        });
        if (role && permission) {
            if (!role.permissions)
                role.permissions = [];
            const hasPermission = role.permissions.some(p => p.id === permission.id);
            if (!hasPermission) {
                role.permissions.push(permission);
                await this.roleRepository.save(role);
            }
        }
    }
    async revokePermissionFromRole(roleId, permissionName) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });
        if (role && role.permissions) {
            role.permissions = role.permissions.filter(p => p.name !== permissionName);
            await this.roleRepository.save(role);
        }
    }
    async getRolePermissions(roleId) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });
        return (role === null || role === void 0 ? void 0 : role.permissions) || [];
    }
    async getAllRoles() {
        return this.roleRepository.find({
            relations: ['permissions'],
            order: { name: 'ASC' }
        });
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map