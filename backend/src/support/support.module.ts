import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportTicket, TicketMessage } from './entities/support-ticket.entity';
import { KnowledgeBaseArticle, FAQItem } from './entities/knowledge-base.entity';
import { ChatSession, ChatMessage } from './entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    SupportTicket,
    TicketMessage,
    KnowledgeBaseArticle,
    FAQItem,
    ChatSession,
    ChatMessage,
  ])],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}