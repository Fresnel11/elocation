import { Repository } from 'typeorm';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../users/entities/user.entity';
export declare class ReportsService {
    private readonly reportRepository;
    constructor(reportRepository: Repository<Report>);
    create(createReportDto: CreateReportDto, reporter: User): Promise<Report>;
    findAll(): Promise<Report[]>;
    findOne(id: string): Promise<Report>;
    updateStatus(id: string, status: ReportStatus, adminNotes?: string): Promise<Report>;
    getReportsByUser(userId: string): Promise<Report[]>;
}
