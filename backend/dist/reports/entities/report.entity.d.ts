import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare enum ReportType {
    AD = "ad",
    USER = "user"
}
export declare enum ReportReason {
    INAPPROPRIATE_CONTENT = "inappropriate_content",
    SPAM = "spam",
    FRAUD = "fraud",
    HARASSMENT = "harassment",
    FAKE_LISTING = "fake_listing",
    OFFENSIVE_BEHAVIOR = "offensive_behavior",
    OTHER = "other"
}
export declare enum ReportStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    RESOLVED = "resolved",
    DISMISSED = "dismissed"
}
export declare class Report {
    id: string;
    type: ReportType;
    reason: ReportReason;
    description: string;
    status: ReportStatus;
    reporterId: string;
    reporter: User;
    reportedAdId: string;
    reportedAd: Ad;
    reportedUserId: string;
    reportedUser: User;
    adminNotes: string;
    createdAt: Date;
    updatedAt: Date;
}
