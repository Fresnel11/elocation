import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.entity';
export declare class Message {
    id: string;
    content: string;
    isRead: boolean;
    sender: User;
    conversation: Conversation;
    createdAt: Date;
}
