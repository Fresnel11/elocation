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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const support_ticket_entity_1 = require("./entities/support-ticket.entity");
const knowledge_base_entity_1 = require("./entities/knowledge-base.entity");
const chat_session_entity_1 = require("./entities/chat-session.entity");
let SupportService = class SupportService {
    constructor(ticketRepository, ticketMessageRepository, knowledgeBaseRepository, faqRepository, chatSessionRepository, chatMessageRepository) {
        this.ticketRepository = ticketRepository;
        this.ticketMessageRepository = ticketMessageRepository;
        this.knowledgeBaseRepository = knowledgeBaseRepository;
        this.faqRepository = faqRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }
    async createTicket(userId, subject, description, priority = support_ticket_entity_1.TicketPriority.MEDIUM) {
        const ticketNumber = `TK${Date.now()}`;
        const ticket = this.ticketRepository.create({
            ticketNumber,
            subject,
            description,
            priority,
            userId,
        });
        return this.ticketRepository.save(ticket);
    }
    async getUserTickets(userId) {
        return this.ticketRepository.find({
            where: { userId },
            relations: ['messages', 'messages.user'],
            order: { createdAt: 'DESC' },
        });
    }
    async getTicketById(ticketId, userId) {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId, userId },
            relations: ['messages', 'messages.user'],
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket non trouvé');
        }
        return ticket;
    }
    async addTicketMessage(ticketId, userId, message, isStaff = false) {
        const ticketMessage = this.ticketMessageRepository.create({
            ticketId,
            userId,
            message,
            isStaff,
        });
        return this.ticketMessageRepository.save(ticketMessage);
    }
    async getFAQs(category) {
        const query = this.faqRepository.createQueryBuilder('faq')
            .where('faq.isActive = :isActive', { isActive: true })
            .orderBy('faq.displayOrder', 'ASC');
        if (category) {
            query.andWhere('faq.category = :category', { category });
        }
        return query.getMany();
    }
    async getFAQCategories() {
        const result = await this.faqRepository
            .createQueryBuilder('faq')
            .select('DISTINCT faq.category', 'category')
            .where('faq.isActive = :isActive', { isActive: true })
            .getRawMany();
        return result.map(item => item.category);
    }
    async incrementFAQView(faqId) {
        await this.faqRepository.increment({ id: faqId }, 'viewCount', 1);
    }
    async getKnowledgeBaseArticles(category, search) {
        const query = this.knowledgeBaseRepository.createQueryBuilder('article')
            .where('article.status = :status', { status: knowledge_base_entity_1.ArticleStatus.PUBLISHED })
            .orderBy('article.createdAt', 'DESC');
        if (category) {
            query.andWhere('article.category = :category', { category });
        }
        if (search) {
            query.andWhere('(article.title ILIKE :search OR article.content ILIKE :search)', {
                search: `%${search}%`,
            });
        }
        return query.getMany();
    }
    async getArticleById(articleId) {
        const article = await this.knowledgeBaseRepository.findOne({
            where: { id: articleId, status: knowledge_base_entity_1.ArticleStatus.PUBLISHED },
        });
        if (!article) {
            throw new common_1.NotFoundException('Article non trouvé');
        }
        await this.knowledgeBaseRepository.increment({ id: articleId }, 'viewCount', 1);
        return article;
    }
    async rateArticle(articleId, helpful) {
        const field = helpful ? 'helpfulCount' : 'notHelpfulCount';
        await this.knowledgeBaseRepository.increment({ id: articleId }, field, 1);
    }
    async startChatSession(userId) {
        const existingSession = await this.chatSessionRepository.findOne({
            where: { userId, status: chat_session_entity_1.ChatStatus.WAITING },
        });
        if (existingSession) {
            return existingSession;
        }
        const session = this.chatSessionRepository.create({
            userId,
            status: chat_session_entity_1.ChatStatus.WAITING,
        });
        return this.chatSessionRepository.save(session);
    }
    async getChatSession(sessionId, userId) {
        const session = await this.chatSessionRepository.findOne({
            where: { id: sessionId, userId },
            relations: ['messages', 'messages.user'],
        });
        if (!session) {
            throw new common_1.NotFoundException('Session de chat non trouvée');
        }
        return session;
    }
    async sendChatMessage(sessionId, userId, message, isAgent = false) {
        const chatMessage = this.chatMessageRepository.create({
            sessionId,
            userId,
            message,
            isAgent,
        });
        return this.chatMessageRepository.save(chatMessage);
    }
    async endChatSession(sessionId) {
        await this.chatSessionRepository.update({ id: sessionId }, { status: chat_session_entity_1.ChatStatus.ENDED, endedAt: new Date() });
    }
    async searchSupport(query) {
        const [faqs, articles] = await Promise.all([
            this.faqRepository
                .createQueryBuilder('faq')
                .where('faq.isActive = :isActive', { isActive: true })
                .andWhere('(faq.question ILIKE :query OR faq.answer ILIKE :query)', { query: `%${query}%` })
                .limit(5)
                .getMany(),
            this.knowledgeBaseRepository
                .createQueryBuilder('article')
                .where('article.status = :status', { status: knowledge_base_entity_1.ArticleStatus.PUBLISHED })
                .andWhere('(article.title ILIKE :query OR article.content ILIKE :query)', { query: `%${query}%` })
                .limit(5)
                .getMany(),
        ]);
        return { faqs, articles };
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(support_ticket_entity_1.SupportTicket)),
    __param(1, (0, typeorm_1.InjectRepository)(support_ticket_entity_1.TicketMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(knowledge_base_entity_1.KnowledgeBaseArticle)),
    __param(3, (0, typeorm_1.InjectRepository)(knowledge_base_entity_1.FAQItem)),
    __param(4, (0, typeorm_1.InjectRepository)(chat_session_entity_1.ChatSession)),
    __param(5, (0, typeorm_1.InjectRepository)(chat_session_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SupportService);
//# sourceMappingURL=support.service.js.map