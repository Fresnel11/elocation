import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private conversationRepository;
    private messageRepository;
    constructor(conversationRepository: Repository<Conversation>, messageRepository: Repository<Message>);
    sendMessage(createMessageDto: CreateMessageDto, senderId: string): Promise<Message>;
    getConversations(userId: string): Promise<Conversation[]>;
    getMessages(conversationId: string, userId: string): Promise<Message[]>;
    markAsRead(conversationId: string, userId: string): Promise<void>;
    private findOrCreateConversation;
}
