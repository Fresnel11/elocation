import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportStatus } from './entities/report.entity';

@ApiTags('Signalements')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un signalement' })
  create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.reportsService.create(createReportDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer tous les signalements (Admin)' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('my-reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mes signalements' })
  getMyReports(@Request() req) {
    return this.reportsService.getReportsByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer un signalement par ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un signalement (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReportStatus,
    @Body('adminNotes') adminNotes?: string
  ) {
    return this.reportsService.updateStatus(id, status, adminNotes);
  }
}