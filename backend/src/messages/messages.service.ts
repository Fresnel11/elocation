import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';


@Injectable()
export class MessagesService {


  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    private notificationsService: NotificationsService,
  ) {}



  async sendMessage(senderId: string, createMessageDto: CreateMessageDto) {
    const { content, receiverId, adId, imageUrl, messageType, isEncrypted } = createMessageDto;

    // Vérifier que l'annonce existe (si adId est fourni)
    let ad: any = null;
    if (adId) {
      ad = await this.adRepository.findOne({ where: { id: adId } });
      if (!ad) {
        throw new NotFoundException('Annonce non trouvée');
      }
    }

    // Vérifier que le destinataire existe
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });
    if (!receiver) {
      throw new NotFoundException('Destinataire non trouvé');
    }

    // Créer le message
    const message = this.messageRepository.create({
      content,
      senderId,
      receiverId,
      adId: adId || null,
      imageUrl: imageUrl || null,
      messageType: messageType || 'text',
      isEncrypted: isEncrypted || false,
    });

    const savedMessage = await this.messageRepository.save(message);
    
    // Recharger le message avec les relations
    const messageWithRelations = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'receiver', 'ad']
    });
    
    // Créer ou mettre à jour la conversation
    const conversation = await this.updateConversation(senderId, receiverId, adId || null, content);

    // TODO: Émettre le message via WebSocket

    // Créer une notification pour le destinataire
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (sender) {
      const notificationMessage = ad 
        ? `${sender.firstName} vous a envoyé un message concernant "${ad.title}"`
        : `${sender.firstName} vous a envoyé un message`;
      
      await this.notificationsService.createNotification(
        receiverId,
        NotificationType.NEW_MESSAGE,
        'Nouveau message',
        notificationMessage,
        adId || undefined
      );
    }

    return messageWithRelations || savedMessage;
  }

  async getConversations(userId: string) {
    const conversations = await this.conversationRepository.find({
      where: [
        { user1Id: userId },
        { user2Id: userId }
      ],
      relations: ['user1', 'user2', 'ad'],
      order: { lastMessageAt: 'DESC' }
    });

    return conversations;
  }

  async getMessages(userId: string, adId: string | null, otherUserId: string) {
    console.log('getMessages called with:', { userId, adId, otherUserId });
    // Vérifier que l'utilisateur fait partie de la conversation
    const whereConditions = adId 
      ? [
          { user1Id: userId, user2Id: otherUserId, adId },
          { user1Id: otherUserId, user2Id: userId, adId }
        ]
      : [
          { user1Id: userId, user2Id: otherUserId, adId: IsNull() },
          { user1Id: otherUserId, user2Id: userId, adId: IsNull() }
        ];

    const conversation = await this.conversationRepository.findOne({
      where: whereConditions
    });

    const messageWhereConditions = adId
      ? [
          { senderId: userId, receiverId: otherUserId, adId },
          { senderId: otherUserId, receiverId: userId, adId }
        ]
      : [
          { senderId: userId, receiverId: otherUserId, adId: IsNull() },
          { senderId: otherUserId, receiverId: userId, adId: IsNull() }
        ];

    const messages = await this.messageRepository.find({
      where: messageWhereConditions,
      relations: ['sender', 'receiver', 'ad'],
      order: { createdAt: 'ASC' }
    });

    console.log('Messages found:', messages.length);
    console.log('Message conditions:', messageWhereConditions);

    // Marquer les messages comme lus
    await this.markMessagesAsRead(userId, otherUserId, adId);

    return messages;
  }

  async markMessagesAsRead(userId: string, otherUserId: string, adId: string | null) {
    const messageWhere = adId
      ? { senderId: otherUserId, receiverId: userId, adId, isRead: false }
      : { senderId: otherUserId, receiverId: userId, adId: IsNull(), isRead: false };

    await this.messageRepository.update(messageWhere, { isRead: true });

    // Mettre à jour le compteur de messages non lus dans la conversation
    const conversationWhere1 = adId
      ? { user1Id: otherUserId, user2Id: userId, adId }
      : { user1Id: otherUserId, user2Id: userId, adId: IsNull() };
    
    const conversationWhere2 = adId
      ? { user1Id: userId, user2Id: otherUserId, adId }
      : { user1Id: userId, user2Id: otherUserId, adId: IsNull() };

    await this.conversationRepository.update(conversationWhere1, { unreadCountUser2: 0 });
    await this.conversationRepository.update(conversationWhere2, { unreadCountUser1: 0 });
  }

  async getUnreadCount(userId: string) {
    const conversations = await this.conversationRepository.find({
      where: [
        { user1Id: userId },
        { user2Id: userId }
      ]
    });

    let totalUnread = 0;
    conversations.forEach(conv => {
      if (conv.user1Id === userId) {
        totalUnread += conv.unreadCountUser1;
      } else {
        totalUnread += conv.unreadCountUser2;
      }
    });

    return { unreadCount: totalUnread };
  }

  private async updateConversation(senderId: string, receiverId: string, adId: string | null, content: string): Promise<Conversation> {
    const whereConditions = adId
      ? [
          { user1Id: senderId, user2Id: receiverId, adId },
          { user1Id: receiverId, user2Id: senderId, adId }
        ]
      : [
          { user1Id: senderId, user2Id: receiverId, adId: IsNull() },
          { user1Id: receiverId, user2Id: senderId, adId: IsNull() }
        ];

    let conversation = await this.conversationRepository.findOne({
      where: whereConditions
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        user1Id: senderId,
        user2Id: receiverId,
        adId,
        lastMessageContent: content,
        lastMessageAt: new Date(),
        unreadCountUser2: 1
      });
    } else {
      conversation.lastMessageContent = content;
      conversation.lastMessageAt = new Date();
      
      if (conversation.user1Id === senderId) {
        conversation.unreadCountUser2++;
      } else {
        conversation.unreadCountUser1++;
      }
    }

    const savedConversation = await this.conversationRepository.save(conversation);
    return savedConversation;
  }

  async createOrGetConversation(senderId: string, receiverId: string, adId?: string) {
    // Vérifier que le destinataire existe
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });
    if (!receiver) {
      throw new NotFoundException('Destinataire non trouvé');
    }

    // Vérifier que l'annonce existe (si adId est fourni)
    if (adId) {
      const ad = await this.adRepository.findOne({ where: { id: adId } });
      if (!ad) {
        throw new NotFoundException('Annonce non trouvée');
      }
    }

    const actualAdId = adId || null;
    const whereConditions = actualAdId
      ? [
          { user1Id: senderId, user2Id: receiverId, adId: actualAdId },
          { user1Id: receiverId, user2Id: senderId, adId: actualAdId }
        ]
      : [
          { user1Id: senderId, user2Id: receiverId, adId: IsNull() },
          { user1Id: receiverId, user2Id: senderId, adId: IsNull() }
        ];

    let conversation = await this.conversationRepository.findOne({
      where: whereConditions,
      relations: ['user1', 'user2', 'ad']
    });

    if (!conversation) {
      // Créer une nouvelle conversation
      conversation = this.conversationRepository.create({
        user1Id: senderId,
        user2Id: receiverId,
        adId: actualAdId,
        lastMessageContent: '',
        lastMessageAt: new Date(),
        unreadCountUser1: 0,
        unreadCountUser2: 0
      });
      conversation = await this.conversationRepository.save(conversation);
      
      // Recharger avec les relations
      conversation = await this.conversationRepository.findOne({
        where: { id: conversation.id },
        relations: ['user1', 'user2', 'ad']
      });
    }

    return {
      conversationId: conversation.id,
      conversation
    };
  }
}