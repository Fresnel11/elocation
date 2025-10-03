import { User } from '../../users/entities/user.entity';
export declare class ActivityLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    oldData: any;
    newData: any;
    ipAddress: string;
    userAgent: string;
    user: User;
    userId: string;
    createdAt: Date;
}
