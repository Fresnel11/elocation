import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupportService } from './support.service';
import { TicketPriority } from './entities/support-ticket.entity';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Tickets
  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer un ticket de support' })
  async createTicket(
    @Request() req,
    @Body('subject') subject: string,
    @Body('description') description: string,
    @Body('priority') priority?: TicketPriority
  ) {
    return this.supportService.createTicket(req.user.id, subject, description, priority);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer mes tickets' })
  async getUserTickets(@Request() req) {
    return this.supportService.getUserTickets(req.user.id);
  }

  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer un ticket par ID' })
  async getTicket(@Request() req, @Param('id') ticketId: string) {
    return this.supportService.getTicketById(ticketId, req.user.id);
  }

  @Post('tickets/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ajouter un message à un ticket' })
  async addTicketMessage(
    @Request() req,
    @Param('id') ticketId: string,
    @Body('message') message: string
  ) {
    return this.supportService.addTicketMessage(ticketId, req.user.id, message);
  }

  // FAQ
  @Get('faq')
  @ApiOperation({ summary: 'Récupérer les FAQs' })
  async getFAQs(@Query('category') category?: string) {
    return this.supportService.getFAQs(category);
  }

  @Get('faq/categories')
  @ApiOperation({ summary: 'Récupérer les catégories FAQ' })
  async getFAQCategories() {
    return this.supportService.getFAQCategories();
  }

  @Post('faq/:id/view')
  @ApiOperation({ summary: 'Incrémenter les vues FAQ' })
  async incrementFAQView(@Param('id') faqId: string) {
    await this.supportService.incrementFAQView(faqId);
    return { success: true };
  }

  // Base de connaissances
  @Get('knowledge-base')
  @ApiOperation({ summary: 'Récupérer les articles de la base de connaissances' })
  async getKnowledgeBaseArticles(
    @Query('category') category?: string,
    @Query('search') search?: string
  ) {
    return this.supportService.getKnowledgeBaseArticles(category, search);
  }

  @Get('knowledge-base/:id')
  @ApiOperation({ summary: 'Récupérer un article par ID' })
  async getArticle(@Param('id') articleId: string) {
    return this.supportService.getArticleById(articleId);
  }

  @Post('knowledge-base/:id/rate')
  @ApiOperation({ summary: 'Noter un article' })
  async rateArticle(
    @Param('id') articleId: string,
    @Body('helpful') helpful: boolean
  ) {
    await this.supportService.rateArticle(articleId, helpful);
    return { success: true };
  }

  // Chat
  @Post('chat/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Démarrer une session de chat' })
  async startChat(@Request() req) {
    return this.supportService.startChatSession(req.user.id);
  }

  @Get('chat/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer une session de chat' })
  async getChatSession(@Request() req, @Param('sessionId') sessionId: string) {
    return this.supportService.getChatSession(sessionId, req.user.id);
  }

  @Post('chat/:sessionId/message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Envoyer un message de chat' })
  async sendChatMessage(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body('message') message: string
  ) {
    return this.supportService.sendChatMessage(sessionId, req.user.id, message);
  }

  // Recherche
  @Get('search')
  @ApiOperation({ summary: 'Rechercher dans le support' })
  async searchSupport(@Query('q') query: string) {
    return this.supportService.searchSupport(query);
  }
}