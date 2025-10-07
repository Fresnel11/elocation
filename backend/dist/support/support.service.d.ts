import { Repository } from 'typeorm';
import { SupportTicket, TicketMessage, TicketPriority } from './entities/support-ticket.entity';
import { KnowledgeBaseArticle, FAQItem } from './entities/knowledge-base.entity';
import { ChatSession, ChatMessage } from './entities/chat-session.entity';
export declare class SupportService {
    private ticketRepository;
    private ticketMessageRepository;
    private knowledgeBaseRepository;
    private faqRepository;
    private chatSessionRepository;
    private chatMessageRepository;
    constructor(ticketRepository: Repository<SupportTicket>, ticketMessageRepository: Repository<TicketMessage>, knowledgeBaseRepository: Repository<KnowledgeBaseArticle>, faqRepository: Repository<FAQItem>, chatSessionRepository: Repository<ChatSession>, chatMessageRepository: Repository<ChatMessage>);
    createTicket(userId: string, subject: string, description: string, priority?: TicketPriority): Promise<SupportTicket>;
    getUserTickets(userId: string): Promise<SupportTicket[]>;
    getTicketById(ticketId: string, userId: string): Promise<SupportTicket>;
    addTicketMessage(ticketId: string, userId: string, message: string, isStaff?: boolean): Promise<TicketMessage>;
    getFAQs(category?: string): Promise<FAQItem[]>;
    getFAQCategories(): Promise<string[]>;
    incrementFAQView(faqId: string): Promise<void>;
    getKnowledgeBaseArticles(category?: string, search?: string): Promise<KnowledgeBaseArticle[]>;
    getArticleById(articleId: string): Promise<KnowledgeBaseArticle>;
    rateArticle(articleId: string, helpful: boolean): Promise<void>;
    startChatSession(userId: string): Promise<ChatSession>;
    getChatSession(sessionId: string, userId: string): Promise<ChatSession>;
    sendChatMessage(sessionId: string, userId: string, message: string, isAgent?: boolean): Promise<ChatMessage>;
    endChatSession(sessionId: string): Promise<void>;
    searchSupport(query: string): Promise<{
        faqs: FAQItem[];
        articles: KnowledgeBaseArticle[];
    }>;
}
