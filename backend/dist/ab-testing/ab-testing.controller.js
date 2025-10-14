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
exports.ABTestingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const ab_testing_service_1 = require("./ab-testing.service");
let ABTestingController = class ABTestingController {
    constructor(abTestingService) {
        this.abTestingService = abTestingService;
    }
    async createTest(data) {
        return this.abTestingService.createTest(data);
    }
    async getAllTests() {
        return this.abTestingService.getAllTests();
    }
    async getActiveTests() {
        return this.abTestingService.getActiveTests();
    }
    async getTestById(id) {
        return this.abTestingService.getTestById(id);
    }
    async getTestResults(id) {
        return this.abTestingService.getTestResults(id);
    }
    async updateTest(id, data) {
        return this.abTestingService.updateTest(id, data);
    }
    async deleteTest(id) {
        await this.abTestingService.deleteTest(id);
        return { success: true };
    }
    async trackMetric(id, variant, metric) {
        await this.abTestingService.trackMetric(id, variant, metric);
        return { success: true };
    }
};
exports.ABTestingController = ABTestingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau test A/B' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "createTest", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les tests A/B' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "getAllTests", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les tests A/B actifs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "getActiveTests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un test A/B par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "getTestById", null);
__decorate([
    (0, common_1.Get)(':id/results'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les résultats d\'un test A/B' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "getTestResults", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un test A/B' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "updateTest", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un test A/B' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "deleteTest", null);
__decorate([
    (0, common_1.Post)(':id/track/:variant/:metric'),
    (0, swagger_1.ApiOperation)({ summary: 'Tracker une métrique pour un test A/B' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variant')),
    __param(2, (0, common_1.Param)('metric')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "trackMetric", null);
exports.ABTestingController = ABTestingController = __decorate([
    (0, swagger_1.ApiTags)('A/B Testing (Admin)'),
    (0, common_1.Controller)('admin/ab-testing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [ab_testing_service_1.ABTestingService])
], ABTestingController);
//# sourceMappingURL=ab-testing.controller.js.map