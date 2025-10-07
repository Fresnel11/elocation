import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketMessage, TicketStatus, TicketPriority } from './entities/support-ticket.entity';
import { KnowledgeBaseArticle, FAQItem, ArticleStatus } from './entities/knowledge-base.entity';
import { ChatSession, ChatMessage, ChatStatus } from './entities/chat-session.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketRepository: Repository<SupportTicket>,
    @InjectRepository(TicketMessage)
    private ticketMessageRepository: Repository<TicketMessage>,
    @InjectRepository(KnowledgeBaseArticle)
    private knowledgeBaseRepository: Repository<KnowledgeBaseArticle>,
    @InjectRepository(FAQItem)
    private faqRepository: Repository<FAQItem>,
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  // Tickets
  async createTicket(userId: string, subject: string, description: string, priority: TicketPriority = TicketPriority.MEDIUM): Promise<SupportTicket> {
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

  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    return this.ticketRepository.find({
      where: { userId },
      relations: ['messages', 'messages.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTicketById(ticketId: string, userId: string): Promise<SupportTicket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId, userId },
      relations: ['messages', 'messages.user'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket non trouvé');
    }

    return ticket;
  }

  async addTicketMessage(ticketId: string, userId: string, message: string, isStaff = false): Promise<TicketMessage> {
    const ticketMessage = this.ticketMessageRepository.create({
      ticketId,
      userId,
      message,
      isStaff,
    });

    return this.ticketMessageRepository.save(ticketMessage);
  }

  // FAQ
  async getFAQs(category?: string): Promise<FAQItem[]> {
    const query = this.faqRepository.createQueryBuilder('faq')
      .where('faq.isActive = :isActive', { isActive: true })
      .orderBy('faq.displayOrder', 'ASC');

    if (category) {
      query.andWhere('faq.category = :category', { category });
    }

    return query.getMany();
  }

  async getFAQCategories(): Promise<string[]> {
    const result = await this.faqRepository
      .createQueryBuilder('faq')
      .select('DISTINCT faq.category', 'category')
      .where('faq.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result.map(item => item.category);
  }

  async incrementFAQView(faqId: string): Promise<void> {
    await this.faqRepository.increment({ id: faqId }, 'viewCount', 1);
  }

  // Base de connaissances
  async getKnowledgeBaseArticles(category?: string, search?: string): Promise<KnowledgeBaseArticle[]> {
    const query = this.knowledgeBaseRepository.createQueryBuilder('article')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
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

  async getArticleById(articleId: string): Promise<KnowledgeBaseArticle> {
    const article = await this.knowledgeBaseRepository.findOne({
      where: { id: articleId, status: ArticleStatus.PUBLISHED },
    });

    if (!article) {
      throw new NotFoundException('Article non trouvé');
    }

    // Incrémenter le compteur de vues
    await this.knowledgeBaseRepository.increment({ id: articleId }, 'viewCount', 1);

    return article;
  }

  async rateArticle(articleId: string, helpful: boolean): Promise<void> {
    const field = helpful ? 'helpfulCount' : 'notHelpfulCount';
    await this.knowledgeBaseRepository.increment({ id: articleId }, field, 1);
  }

  // Chat support
  async startChatSession(userId: string): Promise<ChatSession> {
    // Vérifier s'il y a déjà une session active
    const existingSession = await this.chatSessionRepository.findOne({
      where: { userId, status: ChatStatus.WAITING },
    });

    if (existingSession) {
      return existingSession;
    }

    const session = this.chatSessionRepository.create({
      userId,
      status: ChatStatus.WAITING,
    });

    return this.chatSessionRepository.save(session);
  }

  async getChatSession(sessionId: string, userId: string): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, userId },
      relations: ['messages', 'messages.user'],
    });

    if (!session) {
      throw new NotFoundException('Session de chat non trouvée');
    }

    return session;
  }

  async sendChatMessage(sessionId: string, userId: string, message: string, isAgent = false): Promise<ChatMessage> {
    const chatMessage = this.chatMessageRepository.create({
      sessionId,
      userId,
      message,
      isAgent,
    });

    return this.chatMessageRepository.save(chatMessage);
  }

  async endChatSession(sessionId: string): Promise<void> {
    await this.chatSessionRepository.update(
      { id: sessionId },
      { status: ChatStatus.ENDED, endedAt: new Date() }
    );
  }

  // Recherche globale
  async searchSupport(query: string): Promise<{
    faqs: FAQItem[];
    articles: KnowledgeBaseArticle[];
  }> {
    const [faqs, articles] = await Promise.all([
      this.faqRepository
        .createQueryBuilder('faq')
        .where('faq.isActive = :isActive', { isActive: true })
        .andWhere('(faq.question ILIKE :query OR faq.answer ILIKE :query)', { query: `%${query}%` })
        .limit(5)
        .getMany(),
      
      this.knowledgeBaseRepository
        .createQueryBuilder('article')
        .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
        .andWhere('(article.title ILIKE :query OR article.content ILIKE :query)', { query: `%${query}%` })
        .limit(5)
        .getMany(),
    ]);

    return { faqs, articles };
  }
}