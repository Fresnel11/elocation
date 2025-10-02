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
exports.ResponsesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const responses_service_1 = require("./responses.service");
const create_response_dto_1 = require("./dto/create-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ResponsesController = class ResponsesController {
    constructor(responsesService) {
        this.responsesService = responsesService;
    }
    create(requestId, createResponseDto, req) {
        return this.responsesService.create(requestId, createResponseDto, req.user.id);
    }
    findByRequest(requestId) {
        return this.responsesService.findByRequest(requestId);
    }
};
exports.ResponsesController = ResponsesController;
__decorate([
    (0, common_1.Post)('request/:requestId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une réponse à une demande' }),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_response_dto_1.CreateResponseDto, Object]),
    __metadata("design:returntype", void 0)
], ResponsesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('request/:requestId'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les réponses d\'une demande' }),
    __param(0, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResponsesController.prototype, "findByRequest", null);
exports.ResponsesController = ResponsesController = __decorate([
    (0, swagger_1.ApiTags)('responses'),
    (0, common_1.Controller)('responses'),
    __metadata("design:paramtypes", [responses_service_1.ResponsesService])
], ResponsesController);
//# sourceMappingURL=responses.controller.js.map