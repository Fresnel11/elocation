import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class MessagesService {
    private messageRepository;
    private conversationRepository;
    private userRepository;
    private adRepository;
    private notificationsService;
    constructor(messageRepository: Repository<Message>, conversationRepository: Repository<Conversation>, userRepository: Repository<User>, adRepository: Repository<Ad>, notificationsService: NotificationsService);
    sendMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<Message>;
    getConversations(userId: string): Promise<Conversation[]>;
    getMessages(userId: string, adId: string | null, otherUserId: string): Promise<Message[]>;
    markMessagesAsRead(userId: string, otherUserId: string, adId: string | null): Promise<void>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    private updateConversation;
    createOrGetConversation(senderId: string, receiverId: string, adId?: string): Promise<{
        conversationId: string;
        conversation: Conversation;
    }>;
}
