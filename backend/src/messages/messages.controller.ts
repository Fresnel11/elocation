import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  sendMessage(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messagesService.sendMessage(createMessageDto, req.user.userId);
  }

  @Get('conversations')
  getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @Get('conversations/:id')
  getMessages(@Param('id') conversationId: string, @Request() req) {
    return this.messagesService.getMessages(conversationId, req.user.userId);
  }

  @Patch('conversations/:id/read')
  markAsRead(@Param('id') conversationId: string, @Request() req) {
    return this.messagesService.markAsRead(conversationId, req.user.userId);
  }
}