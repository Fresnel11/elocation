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
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const support_service_1 = require("./support.service");
const support_ticket_entity_1 = require("./entities/support-ticket.entity");
let SupportController = class SupportController {
    constructor(supportService) {
        this.supportService = supportService;
    }
    async createTicket(req, subject, description, priority) {
        return this.supportService.createTicket(req.user.id, subject, description, priority);
    }
    async getUserTickets(req) {
        return this.supportService.getUserTickets(req.user.id);
    }
    async getTicket(req, ticketId) {
        return this.supportService.getTicketById(ticketId, req.user.id);
    }
    async addTicketMessage(req, ticketId, message) {
        return this.supportService.addTicketMessage(ticketId, req.user.id, message);
    }
    async getFAQs(category) {
        return this.supportService.getFAQs(category);
    }
    async getFAQCategories() {
        return this.supportService.getFAQCategories();
    }
    async incrementFAQView(faqId) {
        await this.supportService.incrementFAQView(faqId);
        return { success: true };
    }
    async getKnowledgeBaseArticles(category, search) {
        return this.supportService.getKnowledgeBaseArticles(category, search);
    }
    async getArticle(articleId) {
        return this.supportService.getArticleById(articleId);
    }
    async rateArticle(articleId, helpful) {
        await this.supportService.rateArticle(articleId, helpful);
        return { success: true };
    }
    async startChat(req) {
        return this.supportService.startChatSession(req.user.id);
    }
    async getChatSession(req, sessionId) {
        return this.supportService.getChatSession(sessionId, req.user.id);
    }
    async sendChatMessage(req, sessionId, message) {
        return this.supportService.sendChatMessage(sessionId, req.user.id, message);
    }
    async searchSupport(query) {
        return this.supportService.searchSupport(query);
    }
};
exports.SupportController = SupportController;
__decorate([
    (0, common_1.Post)('tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un ticket de support' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('subject')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('priority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Get)('tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer mes tickets' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getUserTickets", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un ticket par ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getTicket", null);
__decorate([
    (0, common_1.Post)('tickets/:id/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un message à un ticket' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "addTicketMessage", null);
__decorate([
    (0, common_1.Get)('faq'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les FAQs' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getFAQs", null);
__decorate([
    (0, common_1.Get)('faq/categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les catégories FAQ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getFAQCategories", null);
__decorate([
    (0, common_1.Post)('faq/:id/view'),
    (0, swagger_1.ApiOperation)({ summary: 'Incrémenter les vues FAQ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "incrementFAQView", null);
__decorate([
    (0, common_1.Get)('knowledge-base'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les articles de la base de connaissances' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getKnowledgeBaseArticles", null);
__decorate([
    (0, common_1.Get)('knowledge-base/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un article par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getArticle", null);
__decorate([
    (0, common_1.Post)('knowledge-base/:id/rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Noter un article' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('helpful')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "rateArticle", null);
__decorate([
    (0, common_1.Post)('chat/start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Démarrer une session de chat' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "startChat", null);
__decorate([
    (0, common_1.Get)('chat/:sessionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une session de chat' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getChatSession", null);
__decorate([
    (0, common_1.Post)('chat/:sessionId/message'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Envoyer un message de chat' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "sendChatMessage", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Rechercher dans le support' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "searchSupport", null);
exports.SupportController = SupportController = __decorate([
    (0, swagger_1.ApiTags)('Support'),
    (0, common_1.Controller)('support'),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportController);
//# sourceMappingURL=support.controller.js.map