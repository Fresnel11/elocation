import { Controller, Get, Post, Put, Delete, UseGuards, Query, Param, Body, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PermissionsService } from '../permissions/permissions.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users/stats')
  async getUsersStats() {
    return this.adminService.getUsersStats();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllUsers(page, limit, search, role, status);
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Put('users/:id/status')
  @Roles(UserRole.SUPER_ADMIN)
  async updateUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Put('users/:id/role')
  @Roles(UserRole.SUPER_ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body('roleId') roleId: string,
  ) {
    return this.adminService.updateUserRole(id, roleId);
  }

  @Delete('users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  // Gestion des annonces
  @Get('ads')
  async getAllAds(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.adminService.getAllAds(page, limit, search, status, category);
  }

  @Put('ads/:id/status')
  async updateAdStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.updateAdStatus(id, status, reason);
  }

  @Delete('ads/:id')
  @Roles(UserRole.SUPER_ADMIN)
  async deleteAd(@Param('id') id: string) {
    await this.adminService.deleteAd(id);
    return { message: 'Annonce supprimée avec succès' };
  }

  // Gestion des réservations
  @Get('bookings')
  async getAllBookings(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllBookings(page, limit, status, search);
  }

  @Put('bookings/:id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.updateBookingStatus(id, status, reason);
  }

  // Gestion des paramètres
  @Get('settings')
  async getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  @Put('settings/:key')
  @Roles(UserRole.SUPER_ADMIN)
  async updateSystemSetting(
    @Param('key') key: string,
    @Body('value') value: string,
    @Body('type') type?: string,
  ) {
    return this.adminService.updateSystemSetting(key, value, type);
  }

  @Post('settings/initialize')
  @Roles(UserRole.SUPER_ADMIN)
  async initializeDefaultSettings() {
    await this.adminService.initializeDefaultSettings();
    return { message: 'Paramètres par défaut initialisés' };
  }

  // Gestion des logs
  @Get('logs')
  async getActivityLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
  ) {
    return this.adminService.getActivityLogs(page, limit, userId, action);
  }

  @Get('system/stats')
  async getSystemStats() {
    return this.adminService.getSystemStats();
  }

  // Gestion des permissions
  @Get('permissions/:permission')
  async checkPermission(
    @Param('permission') permission: string,
    @Request() req,
  ) {
    const hasPermission = await this.permissionsService.hasPermission(req.user.id, permission);
    return { hasPermission };
  }

  // Création d'utilisateur avec vérification de permission
  @Post('users')
  async createUser(
    @Body() userData: any,
    @Request() req,
  ) {
    const canCreateUser = await this.permissionsService.hasPermission(req.user.id, 'create_user');
    if (!canCreateUser) {
      throw new Error('Permission insuffisante pour créer un utilisateur');
    }
    return this.adminService.createUser(userData);
  }

  // Gestion des permissions - Super Admin seulement
  @Get('permissions')
  @Roles(UserRole.SUPER_ADMIN)
  async getAllPermissions() {
    return this.adminService.getAllPermissions();
  }

  @Post('permissions')
  @Roles(UserRole.SUPER_ADMIN)
  async createPermission(@Body() permissionData: any) {
    return this.adminService.createPermission(permissionData);
  }

  @Delete('permissions/:id')
  @Roles(UserRole.SUPER_ADMIN)
  async deletePermission(@Param('id') id: string) {
    await this.adminService.deletePermission(id);
    return { message: 'Permission supprimée avec succès' };
  }

  @Get('roles/with-permissions')
  @Roles(UserRole.SUPER_ADMIN)
  async getRolesWithPermissions() {
    return this.adminService.getRolesWithPermissions();
  }

  @Put('roles/:id/permissions')
  @Roles(UserRole.SUPER_ADMIN)
  async updateRolePermissions(
    @Param('id') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.adminService.updateRolePermissions(roleId, permissionIds);
  }
}