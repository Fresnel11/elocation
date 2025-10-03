import { Controller, Get } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';

@Controller('public')
export class CommonController {
  constructor(private readonly adminService: AdminService) {}

  @Get('settings')
  async getPublicSettings() {
    return this.adminService.getPublicSettings();
  }
}