import { SupportService } from './support.service';
import { TicketPriority } from './entities/support-ticket.entity';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(req: any, subject: string, description: string, priority?: TicketPriority): Promise<import("./entities/support-ticket.entity").SupportTicket>;
    getUserTickets(req: any): Promise<import("./entities/support-ticket.entity").SupportTicket[]>;
    getTicket(req: any, ticketId: string): Promise<import("./entities/support-ticket.entity").SupportTicket>;
    addTicketMessage(req: any, ticketId: string, message: string): Promise<import("./entities/support-ticket.entity").TicketMessage>;
    getFAQs(category?: string): Promise<import("./entities/knowledge-base.entity").FAQItem[]>;
    getFAQCategories(): Promise<string[]>;
    incrementFAQView(faqId: string): Promise<{
        success: boolean;
    }>;
    getKnowledgeBaseArticles(category?: string, search?: string): Promise<import("./entities/knowledge-base.entity").KnowledgeBaseArticle[]>;
    getArticle(articleId: string): Promise<import("./entities/knowledge-base.entity").KnowledgeBaseArticle>;
    rateArticle(articleId: string, helpful: boolean): Promise<{
        success: boolean;
    }>;
    startChat(req: any): Promise<import("./entities/chat-session.entity").ChatSession>;
    getChatSession(req: any, sessionId: string): Promise<import("./entities/chat-session.entity").ChatSession>;
    sendChatMessage(req: any, sessionId: string, message: string): Promise<import("./entities/chat-session.entity").ChatMessage>;
    searchSupport(query: string): Promise<{
        faqs: import("./entities/knowledge-base.entity").FAQItem[];
        articles: import("./entities/knowledge-base.entity").KnowledgeBaseArticle[];
    }>;
}
