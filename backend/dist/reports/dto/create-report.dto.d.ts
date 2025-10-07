import { ReportType, ReportReason } from '../entities/report.entity';
export declare class CreateReportDto {
    type: ReportType;
    reason: ReportReason;
    description?: string;
    reportedAdId?: string;
    reportedUserId?: string;
}
