import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async sendMessage(createMessageDto: CreateMessageDto, senderId: string): Promise<Message> {
    let conversation = await this.findOrCreateConversation(senderId, createMessageDto.recipientId);

    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender: { id: senderId },
      conversation: { id: conversation.id }
    });

    return this.messageRepository.save(message);
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.user1', 'user1')
      .leftJoinAndSelect('conversation.user2', 'user2')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('conversation.user1Id = :userId OR conversation.user2Id = :userId', { userId })
      .orderBy('conversation.updatedAt', 'DESC')
      .addOrderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['user1', 'user2']
    });

    if (!conversation || (conversation.user1.id !== userId && conversation.user2.id !== userId)) {
      throw new Error('Conversation non trouvée ou accès non autorisé');
    }

    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' }
    });
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('senderId != :userId', { userId })
      .execute();
  }

  private async findOrCreateConversation(user1Id: string, user2Id: string): Promise<Conversation> {
    let conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('(conversation.user1Id = :user1Id AND conversation.user2Id = :user2Id)', { user1Id, user2Id })
      .orWhere('(conversation.user1Id = :user2Id AND conversation.user2Id = :user1Id)', { user1Id: user2Id, user2Id: user1Id })
      .getOne();

    if (!conversation) {
      conversation = this.conversationRepository.create({
        user1: { id: user1Id },
        user2: { id: user2Id }
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    return conversation;
  }
}