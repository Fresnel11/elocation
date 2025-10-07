import { User } from '../../users/entities/user.entity';
export declare enum ChatStatus {
    WAITING = "waiting",
    ACTIVE = "active",
    ENDED = "ended"
}
export declare class ChatSession {
    id: string;
    userId: string;
    user: User;
    agentId: string;
    agent: User;
    status: ChatStatus;
    startedAt: Date;
    endedAt: Date;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class ChatMessage {
    id: string;
    sessionId: string;
    session: ChatSession;
    userId: string;
    user: User;
    message: string;
    isAgent: boolean;
    createdAt: Date;
}
