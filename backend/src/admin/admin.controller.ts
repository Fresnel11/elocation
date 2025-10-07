import { Controller, Get, Post, Put, Delete, UseGuards, Query, Param, Body, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  // Gestion des catégories
  @Post('categories')
  async createCategory(@Body() categoryData: any) {
    return this.adminService.createCategory(categoryData);
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() categoryData: any) {
    return this.adminService.updateCategory(id, categoryData);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    await this.adminService.deleteCategory(id);
    return { message: 'Catégorie supprimée avec succès' };
  }

  @Post('subcategories')
  async createSubCategory(@Body() subCategoryData: any) {
    return this.adminService.createSubCategory(subCategoryData);
  }

  @Put('subcategories/:id')
  async updateSubCategory(@Param('id') id: string, @Body() subCategoryData: any) {
    return this.adminService.updateSubCategory(id, subCategoryData);
  }

  @Delete('subcategories/:id')
  async deleteSubCategory(@Param('id') id: string) {
    await this.adminService.deleteSubCategory(id);
    return { message: 'Sous-catégorie supprimée avec succès' };
  }

  @Put('roles/:id/permissions')
  @Roles(UserRole.SUPER_ADMIN)
  async updateRolePermissions(
    @Param('id') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.adminService.updateRolePermissions(roleId, permissionIds);
  }

  @Get('reviews/pending')
  async getPendingReviews() {
    return this.adminService.getPendingReviews();
  }

  @Post('reviews/:id/approve')
  async approveReview(@Param('id') id: string) {
    return this.adminService.approveReview(id);
  }

  @Post('reviews/:id/reject')
  async rejectReview(@Param('id') id: string) {
    return this.adminService.rejectReview(id);
  }

  @Get('reports')
  async getReports(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getReports(status, type, page, limit);
  }

  @Post('reports/:id/resolve')
  async resolveReport(@Param('id') id: string, @Body('action') action: string) {
    return this.adminService.resolveReport(id, action);
  }

  @Post('reports/:id/dismiss')
  async dismissReport(@Param('id') id: string) {
    return this.adminService.dismissReport(id);
  }

  @Get('email-templates')
  async getEmailTemplates() {
    return this.adminService.getEmailTemplates();
  }

  @Put('email-templates/:id')
  async updateEmailTemplate(
    @Param('id') id: string,
    @Body() templateData: any,
  ) {
    return this.adminService.updateEmailTemplate(id, templateData);
  }

  @Post('email-templates/initialize')
  async initializeEmailTemplates() {
    return this.adminService.initializeEmailTemplates();
  }

  @Post('maintenance/enable')
  @Roles(UserRole.SUPER_ADMIN)
  async enableMaintenance(@Body('message') message?: string) {
    return this.adminService.enableMaintenance(message);
  }

  @Post('maintenance/disable')
  @Roles(UserRole.SUPER_ADMIN)
  async disableMaintenance() {
    return this.adminService.disableMaintenance();
  }

  @Get('maintenance/status')
  async getMaintenanceStatus() {
    return this.adminService.getMaintenanceStatus();
  }

  @Post('backup/create')
  @Roles(UserRole.SUPER_ADMIN)
  async createBackup() {
    return this.adminService.createBackup();
  }

  @Get('backup/list')
  @Roles(UserRole.SUPER_ADMIN)
  async listBackups() {
    return this.adminService.listBackups();
  }

  @Get('financial/overview')
  async getFinancialOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getFinancialOverview(startDate, endDate);
  }

  @Get('financial/revenue-chart')
  async getRevenueChart(
    @Query('period') period?: string,
  ) {
    return this.adminService.getRevenueChart(period);
  }

  @Get('financial/commissions')
  async getCommissions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getCommissions(page, limit);
  }

  @Get('media/files')
  async getMediaFiles(
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getMediaFiles(type, page, limit);
  }

  @Delete('media/files/:filename')
  @Roles(UserRole.SUPER_ADMIN)
  async deleteMediaFile(@Param('filename') filename: string) {
    return this.adminService.deleteMediaFile(filename);
  }

  @Get('media/stats')
  async getMediaStats() {
    return this.adminService.getMediaStats();
  }

  @Get('support/tickets')
  async getSupportTickets(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getSupportTickets(status, priority, page, limit);
  }

  @Get('support/tickets/:id')
  async getTicketDetails(@Param('id') id: string) {
    return this.adminService.getTicketDetails(id);
  }

  @Post('support/tickets/:id/reply')
  async replyToTicket(
    @Param('id') id: string,
    @Body('message') message: string,
    @Request() req,
  ) {
    return this.adminService.replyToTicket(id, message, req.user.userId);
  }

  @Put('support/tickets/:id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateTicketStatus(id, status);
  }

  @Put('support/tickets/:id/assign')
  async assignTicket(
    @Param('id') id: string,
    @Body('adminId') adminId: string,
  ) {
    return this.adminService.assignTicket(id, adminId);
  }

  @Get('audit/trail')
  async getAuditTrail(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAuditTrail({
      entityType,
      entityId,
      userId,
      action,
      startDate,
      endDate,
      page,
      limit
    });
  }

  @Get('audit/entity/:entityType/:entityId')
  async getEntityAuditHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.adminService.getEntityAuditHistory(entityType, entityId);
  }

  @Get('monitoring/system-health')
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('monitoring/performance')
  async getPerformanceMetrics(
    @Query('period') period?: string,
  ) {
    return this.adminService.getPerformanceMetrics(period);
  }

  @Get('monitoring/errors')
  async getErrorLogs(
    @Query('severity') severity?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getErrorLogs(severity, page, limit);
  }

  @Get('monitoring/alerts')
  async getActiveAlerts() {
    return this.adminService.getActiveAlerts();
  }

  @Post('monitoring/alerts/:id/acknowledge')
  async acknowledgeAlert(@Param('id') id: string) {
    return this.adminService.acknowledgeAlert(id);
  }

  @Get('sessions/active')
  async getActiveSessions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
  ) {
    return this.adminService.getActiveSessions(page, limit, userId);
  }

  @Post('sessions/:sessionId/terminate')
  async terminateSession(@Param('sessionId') sessionId: string) {
    return this.adminService.terminateSession(sessionId);
  }

  @Post('sessions/user/:userId/terminate-all')
  async terminateAllUserSessions(@Param('userId') userId: string) {
    return this.adminService.terminateAllUserSessions(userId);
  }

  @Get('sessions/stats')
  async getSessionStats() {
    return this.adminService.getSessionStats();
  }

  // Import/Export endpoints
  @Get('export/data')
  async exportData(@Query('tables') tables?: string) {
    return this.adminService.exportData(tables);
  }

  @Post('import/data')
  @UseInterceptors(FileInterceptor('file'))
  async importData(@UploadedFile() file: any) {
    return this.adminService.importData(file);
  }

  @Get('export/stats')
  async getExportStats() {
    return this.adminService.getExportStats();
  }

  @Post('export/schedule')
  async scheduleExport(@Body() scheduleData: any) {
    return this.adminService.scheduleExport(scheduleData);
  }

  @Get('export/history')
  async getExportHistory() {
    return this.adminService.getExportHistory();
  }

  // Cleanup endpoints
  @Get('cleanup/stats')
  async getCleanupStats() {
    return this.adminService.getCleanupStats();
  }

  @Post('cleanup/run')
  async runCleanup(@Body() cleanupData: any) {
    return this.adminService.runCleanup(cleanupData);
  }

  @Get('cleanup/history')
  async getCleanupHistory() {
    return this.adminService.getCleanupHistory();
  }

  @Post('cleanup/schedule')
  async scheduleCleanup(@Body() scheduleData: any) {
    return this.adminService.scheduleCleanup(scheduleData);
  }

  // System tests endpoints
  @Get('tests/integrity')
  async getIntegrityTests() {
    return this.adminService.getIntegrityTests();
  }

  @Post('tests/run')
  async runIntegrityTests(@Body() testData: any) {
    return this.adminService.runIntegrityTests(testData);
  }

  @Get('tests/history')
  async getTestHistory() {
    return this.adminService.getTestHistory();
  }

  @Post('tests/fix')
  async fixIntegrityIssues(@Body() fixData: any) {
    return this.adminService.fixIntegrityIssues(fixData);
  }
}