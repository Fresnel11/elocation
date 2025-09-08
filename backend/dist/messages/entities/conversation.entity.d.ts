import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';
export declare class Conversation {
    id: string;
    user1: User;
    user2: User;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
