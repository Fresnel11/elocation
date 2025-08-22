import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('pending-ads')
  getPendingAds() {
    return this.adminService.getPendingAds();
  }

  @Patch('ads/:id/moderate')
  moderateAd(
    @Param('id') id: string,
    @Body('action') action: 'approve' | 'reject',
  ) {
    return this.adminService.moderateAd(id, action);
  }

  @Get('recent-users')
  getRecentUsers(@Query('limit') limit?: string) {
    return this.adminService.getRecentUsers(limit ? parseInt(limit) : 10);
  }

  @Get('recent-payments')
  getRecentPayments(@Query('limit') limit?: string) {
    return this.adminService.getRecentPayments(limit ? parseInt(limit) : 10);
  }
}