import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ABTestingService } from './ab-testing.service';

@ApiTags('A/B Testing (Admin)')
@Controller('admin/ab-testing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class ABTestingController {
  constructor(private readonly abTestingService: ABTestingService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau test A/B' })
  async createTest(@Body() data: any) {
    return this.abTestingService.createTest(data);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les tests A/B' })
  async getAllTests() {
    return this.abTestingService.getAllTests();
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer les tests A/B actifs' })
  async getActiveTests() {
    return this.abTestingService.getActiveTests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un test A/B par ID' })
  async getTestById(@Param('id') id: string) {
    return this.abTestingService.getTestById(id);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Récupérer les résultats d\'un test A/B' })
  async getTestResults(@Param('id') id: string) {
    return this.abTestingService.getTestResults(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un test A/B' })
  async updateTest(@Param('id') id: string, @Body() data: any) {
    return this.abTestingService.updateTest(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un test A/B' })
  async deleteTest(@Param('id') id: string) {
    await this.abTestingService.deleteTest(id);
    return { success: true };
  }

  @Post(':id/track/:variant/:metric')
  @ApiOperation({ summary: 'Tracker une métrique pour un test A/B' })
  async trackMetric(
    @Param('id') id: string,
    @Param('variant') variant: 'A' | 'B',
    @Param('metric') metric: 'views' | 'clicks' | 'conversions'
  ) {
    await this.abTestingService.trackMetric(id, variant, metric);
    return { success: true };
  }
}