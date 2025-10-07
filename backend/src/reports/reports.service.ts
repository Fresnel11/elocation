import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, reporter: User): Promise<Report> {
    if (!createReportDto.reportedAdId && !createReportDto.reportedUserId) {
      throw new BadRequestException('Either reportedAdId or reportedUserId must be provided');
    }

    const report = this.reportRepository.create({
      ...createReportDto,
      reporterId: reporter.id,
    });

    return this.reportRepository.save(report);
  }

  async findAll() {
    return this.reportRepository.find({
      relations: ['reporter', 'reportedAd', 'reportedUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['reporter', 'reportedAd', 'reportedUser'],
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async updateStatus(id: string, status: ReportStatus, adminNotes?: string): Promise<Report> {
    const report = await this.findOne(id);
    
    report.status = status;
    if (adminNotes) {
      report.adminNotes = adminNotes;
    }

    return this.reportRepository.save(report);
  }

  async getReportsByUser(userId: string) {
    return this.reportRepository.find({
      where: { reporterId: userId },
      relations: ['reportedAd', 'reportedUser'],
      order: { createdAt: 'DESC' },
    });
  }
}