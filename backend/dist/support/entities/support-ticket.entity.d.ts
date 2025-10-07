import { User } from '../../users/entities/user.entity';
export declare enum TicketStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare enum TicketPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class SupportTicket {
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    userId: string;
    user: User;
    assignedTo: string;
    assignedAgent: User;
    messages: TicketMessage[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class TicketMessage {
    id: string;
    ticketId: string;
    ticket: SupportTicket;
    userId: string;
    user: User;
    message: string;
    isStaff: boolean;
    createdAt: Date;
}
