import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(req: any, createMessageDto: CreateMessageDto): Promise<import("./entities/message.entity").Message>;
    getConversations(req: any): Promise<import("./entities/conversation.entity").Conversation[]>;
    getMessages(req: any, adId: string, otherUserId: string): Promise<import("./entities/message.entity").Message[]>;
    getDirectMessages(req: any, otherUserId: string): Promise<import("./entities/message.entity").Message[]>;
    markAsRead(req: any, adId: string, otherUserId: string): Promise<{
        success: boolean;
    }>;
    markDirectAsRead(req: any, otherUserId: string): Promise<{
        success: boolean;
    }>;
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
    }>;
    createOrGetConversation(req: any, body: {
        receiverId: string;
        adId?: string;
    }): Promise<{
        conversationId: string;
        conversation: import("./entities/conversation.entity").Conversation;
    }>;
}
