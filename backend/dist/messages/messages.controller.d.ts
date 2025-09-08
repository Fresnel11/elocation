import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(createMessageDto: CreateMessageDto, req: any): Promise<import("./entities/message.entity").Message>;
    getConversations(req: any): Promise<import("./entities/conversation.entity").Conversation[]>;
    getMessages(conversationId: string, req: any): Promise<import("./entities/message.entity").Message[]>;
    markAsRead(conversationId: string, req: any): Promise<void>;
}
