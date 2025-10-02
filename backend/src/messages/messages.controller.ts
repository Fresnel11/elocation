import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.sendMessage(req.user.id, createMessageDto);
  }

  @Get('conversations')
  async getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('conversation/:adId/:otherUserId')
  async getMessages(
    @Request() req,
    @Param('adId') adId: string,
    @Param('otherUserId') otherUserId: string
  ) {
    const actualAdId = adId === 'direct' || adId === '' ? null : adId;
    console.log('Regular endpoint called with adId:', adId, 'converted to:', actualAdId);
    return this.messagesService.getMessages(req.user.id, actualAdId, otherUserId);
  }

  @Get('conversation/direct/:otherUserId')
  async getDirectMessages(
    @Request() req,
    @Param('otherUserId') otherUserId: string
  ) {
    console.log('Direct messages endpoint called for:', otherUserId);
    return this.messagesService.getMessages(req.user.id, null, otherUserId);
  }

  @Post('mark-read/:adId/:otherUserId')
  async markAsRead(
    @Request() req,
    @Param('adId') adId: string,
    @Param('otherUserId') otherUserId: string
  ) {
    const actualAdId = adId === 'direct' || adId === '' ? null : adId;
    console.log('Mark as read called with adId:', adId, 'converted to:', actualAdId);
    await this.messagesService.markMessagesAsRead(req.user.id, otherUserId, actualAdId);
    return { success: true };
  }

  @Post('mark-read/direct/:otherUserId')
  async markDirectAsRead(
    @Request() req,
    @Param('otherUserId') otherUserId: string
  ) {
    console.log('Mark direct as read called for:', otherUserId);
    await this.messagesService.markMessagesAsRead(req.user.id, otherUserId, null);
    return { success: true };
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.id);
  }
}