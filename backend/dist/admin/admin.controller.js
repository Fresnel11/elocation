"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../common/guards/admin.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const permissions_service_1 = require("../permissions/permissions.service");
let AdminController = class AdminController {
    constructor(adminService, permissionsService) {
        this.adminService = adminService;
        this.permissionsService = permissionsService;
    }
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    async getUsersStats() {
        return this.adminService.getUsersStats();
    }
    async getAnalytics() {
        return this.adminService.getAnalytics();
    }
    async getAllUsers(page, limit, search, role, status) {
        return this.adminService.getAllUsers(page, limit, search, role, status);
    }
    async getUserDetails(id) {
        return this.adminService.getUserDetails(id);
    }
    async updateUserStatus(id, isActive) {
        return this.adminService.updateUserStatus(id, isActive);
    }
    async updateUserRole(id, roleId) {
        return this.adminService.updateUserRole(id, roleId);
    }
    async deleteUser(id) {
        await this.adminService.deleteUser(id);
        return { message: 'Utilisateur supprimé avec succès' };
    }
    async getAllAds(page, limit, search, status, category) {
        return this.adminService.getAllAds(page, limit, search, status, category);
    }
    async updateAdStatus(id, status, reason) {
        return this.adminService.updateAdStatus(id, status, reason);
    }
    async deleteAd(id) {
        await this.adminService.deleteAd(id);
        return { message: 'Annonce supprimée avec succès' };
    }
    async getAllBookings(page, limit, status, search) {
        return this.adminService.getAllBookings(page, limit, status, search);
    }
    async updateBookingStatus(id, status, reason) {
        return this.adminService.updateBookingStatus(id, status, reason);
    }
    async getSystemSettings() {
        return this.adminService.getSystemSettings();
    }
    async updateSystemSetting(key, value, type) {
        return this.adminService.updateSystemSetting(key, value, type);
    }
    async initializeDefaultSettings() {
        await this.adminService.initializeDefaultSettings();
        return { message: 'Paramètres par défaut initialisés' };
    }
    async getActivityLogs(page, limit, userId, action) {
        return this.adminService.getActivityLogs(page, limit, userId, action);
    }
    async getSystemStats() {
        return this.adminService.getSystemStats();
    }
    async checkPermission(permission, req) {
        const hasPermission = await this.permissionsService.hasPermission(req.user.id, permission);
        return { hasPermission };
    }
    async createUser(userData, req) {
        const canCreateUser = await this.permissionsService.hasPermission(req.user.id, 'create_user');
        if (!canCreateUser) {
            throw new Error('Permission insuffisante pour créer un utilisateur');
        }
        return this.adminService.createUser(userData);
    }
    async getAllPermissions() {
        return this.adminService.getAllPermissions();
    }
    async createPermission(permissionData) {
        return this.adminService.createPermission(permissionData);
    }
    async deletePermission(id) {
        await this.adminService.deletePermission(id);
        return { message: 'Permission supprimée avec succès' };
    }
    async getRolesWithPermissions() {
        return this.adminService.getRolesWithPermissions();
    }
    async createCategory(categoryData) {
        return this.adminService.createCategory(categoryData);
    }
    async updateCategory(id, categoryData) {
        return this.adminService.updateCategory(id, categoryData);
    }
    async deleteCategory(id) {
        await this.adminService.deleteCategory(id);
        return { message: 'Catégorie supprimée avec succès' };
    }
    async createSubCategory(subCategoryData) {
        return this.adminService.createSubCategory(subCategoryData);
    }
    async updateSubCategory(id, subCategoryData) {
        return this.adminService.updateSubCategory(id, subCategoryData);
    }
    async deleteSubCategory(id) {
        await this.adminService.deleteSubCategory(id);
        return { message: 'Sous-catégorie supprimée avec succès' };
    }
    async updateRolePermissions(roleId, permissionIds) {
        return this.adminService.updateRolePermissions(roleId, permissionIds);
    }
    async getPendingReviews() {
        return this.adminService.getPendingReviews();
    }
    async approveReview(id) {
        return this.adminService.approveReview(id);
    }
    async rejectReview(id) {
        return this.adminService.rejectReview(id);
    }
    async getReports(status, type, page, limit) {
        return this.adminService.getReports(status, type, page, limit);
    }
    async resolveReport(id, action) {
        return this.adminService.resolveReport(id, action);
    }
    async dismissReport(id) {
        return this.adminService.dismissReport(id);
    }
    async getEmailTemplates() {
        return this.adminService.getEmailTemplates();
    }
    async updateEmailTemplate(id, templateData) {
        return this.adminService.updateEmailTemplate(id, templateData);
    }
    async initializeEmailTemplates() {
        return this.adminService.initializeEmailTemplates();
    }
    async enableMaintenance(message) {
        return this.adminService.enableMaintenance(message);
    }
    async disableMaintenance() {
        return this.adminService.disableMaintenance();
    }
    async getMaintenanceStatus() {
        return this.adminService.getMaintenanceStatus();
    }
    async createBackup() {
        return this.adminService.createBackup();
    }
    async listBackups() {
        return this.adminService.listBackups();
    }
    async getFinancialOverview(startDate, endDate) {
        return this.adminService.getFinancialOverview(startDate, endDate);
    }
    async getRevenueChart(period) {
        return this.adminService.getRevenueChart(period);
    }
    async getCommissions(page, limit) {
        return this.adminService.getCommissions(page, limit);
    }
    async getMediaFiles(type, page, limit) {
        return this.adminService.getMediaFiles(type, page, limit);
    }
    async deleteMediaFile(filename) {
        return this.adminService.deleteMediaFile(filename);
    }
    async getMediaStats() {
        return this.adminService.getMediaStats();
    }
    async getSupportTickets(status, priority, page, limit) {
        return this.adminService.getSupportTickets(status, priority, page, limit);
    }
    async getTicketDetails(id) {
        return this.adminService.getTicketDetails(id);
    }
    async replyToTicket(id, message, req) {
        return this.adminService.replyToTicket(id, message, req.user.userId);
    }
    async updateTicketStatus(id, status) {
        return this.adminService.updateTicketStatus(id, status);
    }
    async assignTicket(id, adminId) {
        return this.adminService.assignTicket(id, adminId);
    }
    async getAuditTrail(entityType, entityId, userId, action, startDate, endDate, page, limit) {
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
    async getEntityAuditHistory(entityType, entityId) {
        return this.adminService.getEntityAuditHistory(entityType, entityId);
    }
    async getSystemHealth() {
        return this.adminService.getSystemHealth();
    }
    async getPerformanceMetrics(period) {
        return this.adminService.getPerformanceMetrics(period);
    }
    async getErrorLogs(severity, page, limit) {
        return this.adminService.getErrorLogs(severity, page, limit);
    }
    async getActiveAlerts() {
        return this.adminService.getActiveAlerts();
    }
    async acknowledgeAlert(id) {
        return this.adminService.acknowledgeAlert(id);
    }
    async getActiveSessions(page, limit, userId) {
        return this.adminService.getActiveSessions(page, limit, userId);
    }
    async terminateSession(sessionId) {
        return this.adminService.terminateSession(sessionId);
    }
    async terminateAllUserSessions(userId) {
        return this.adminService.terminateAllUserSessions(userId);
    }
    async getSessionStats() {
        return this.adminService.getSessionStats();
    }
    async exportData(tables) {
        return this.adminService.exportData(tables);
    }
    async importData(file) {
        return this.adminService.importData(file);
    }
    async getExportStats() {
        return this.adminService.getExportStats();
    }
    async scheduleExport(scheduleData) {
        return this.adminService.scheduleExport(scheduleData);
    }
    async getExportHistory() {
        return this.adminService.getExportHistory();
    }
    async getCleanupStats() {
        return this.adminService.getCleanupStats();
    }
    async runCleanup(cleanupData) {
        return this.adminService.runCleanup(cleanupData);
    }
    async getCleanupHistory() {
        return this.adminService.getCleanupHistory();
    }
    async scheduleCleanup(scheduleData) {
        return this.adminService.scheduleCleanup(scheduleData);
    }
    async getIntegrityTests() {
        return this.adminService.getIntegrityTests();
    }
    async runIntegrityTests(testData) {
        return this.adminService.runIntegrityTests(testData);
    }
    async getTestHistory() {
        return this.adminService.getTestHistory();
    }
    async fixIntegrityIssues(fixData) {
        return this.adminService.fixIntegrityIssues(fixData);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('users/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsersStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('role')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Put)('users/:id/status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Put)('users/:id/role'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('ads'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAds", null);
__decorate([
    (0, common_1.Put)('ads/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdStatus", null);
__decorate([
    (0, common_1.Delete)('ads/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAd", null);
__decorate([
    (0, common_1.Get)('bookings'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Put)('bookings/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemSettings", null);
__decorate([
    (0, common_1.Put)('settings/:key'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)('value')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSystemSetting", null);
__decorate([
    (0, common_1.Post)('settings/initialize'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "initializeDefaultSettings", null);
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getActivityLogs", null);
__decorate([
    (0, common_1.Get)('system/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemStats", null);
__decorate([
    (0, common_1.Get)('permissions/:permission'),
    __param(0, (0, common_1.Param)('permission')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Post)('permissions'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Delete)('permissions/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePermission", null);
__decorate([
    (0, common_1.Get)('roles/with-permissions'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRolesWithPermissions", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('subcategories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSubCategory", null);
__decorate([
    (0, common_1.Put)('subcategories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSubCategory", null);
__decorate([
    (0, common_1.Delete)('subcategories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSubCategory", null);
__decorate([
    (0, common_1.Put)('roles/:id/permissions'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('permissionIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRolePermissions", null);
__decorate([
    (0, common_1.Get)('reviews/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingReviews", null);
__decorate([
    (0, common_1.Post)('reviews/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveReview", null);
__decorate([
    (0, common_1.Post)('reviews/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectReview", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReports", null);
__decorate([
    (0, common_1.Post)('reports/:id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resolveReport", null);
__decorate([
    (0, common_1.Post)('reports/:id/dismiss'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "dismissReport", null);
__decorate([
    (0, common_1.Get)('email-templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getEmailTemplates", null);
__decorate([
    (0, common_1.Put)('email-templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateEmailTemplate", null);
__decorate([
    (0, common_1.Post)('email-templates/initialize'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "initializeEmailTemplates", null);
__decorate([
    (0, common_1.Post)('maintenance/enable'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "enableMaintenance", null);
__decorate([
    (0, common_1.Post)('maintenance/disable'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "disableMaintenance", null);
__decorate([
    (0, common_1.Get)('maintenance/status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMaintenanceStatus", null);
__decorate([
    (0, common_1.Post)('backup/create'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)('backup/list'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listBackups", null);
__decorate([
    (0, common_1.Get)('financial/overview'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getFinancialOverview", null);
__decorate([
    (0, common_1.Get)('financial/revenue-chart'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRevenueChart", null);
__decorate([
    (0, common_1.Get)('financial/commissions'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCommissions", null);
__decorate([
    (0, common_1.Get)('media/files'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMediaFiles", null);
__decorate([
    (0, common_1.Delete)('media/files/:filename'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteMediaFile", null);
__decorate([
    (0, common_1.Get)('media/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMediaStats", null);
__decorate([
    (0, common_1.Get)('support/tickets'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('priority')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSupportTickets", null);
__decorate([
    (0, common_1.Get)('support/tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTicketDetails", null);
__decorate([
    (0, common_1.Post)('support/tickets/:id/reply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('message')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "replyToTicket", null);
__decorate([
    (0, common_1.Put)('support/tickets/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateTicketStatus", null);
__decorate([
    (0, common_1.Put)('support/tickets/:id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignTicket", null);
__decorate([
    (0, common_1.Get)('audit/trail'),
    __param(0, (0, common_1.Query)('entityType')),
    __param(1, (0, common_1.Query)('entityId')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditTrail", null);
__decorate([
    (0, common_1.Get)('audit/entity/:entityType/:entityId'),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getEntityAuditHistory", null);
__decorate([
    (0, common_1.Get)('monitoring/system-health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('monitoring/performance'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, common_1.Get)('monitoring/errors'),
    __param(0, (0, common_1.Query)('severity')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getErrorLogs", null);
__decorate([
    (0, common_1.Get)('monitoring/alerts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getActiveAlerts", null);
__decorate([
    (0, common_1.Post)('monitoring/alerts/:id/acknowledge'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, common_1.Get)('sessions/active'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getActiveSessions", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/terminate'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "terminateSession", null);
__decorate([
    (0, common_1.Post)('sessions/user/:userId/terminate-all'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "terminateAllUserSessions", null);
__decorate([
    (0, common_1.Get)('sessions/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSessionStats", null);
__decorate([
    (0, common_1.Get)('export/data'),
    __param(0, (0, common_1.Query)('tables')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportData", null);
__decorate([
    (0, common_1.Post)('import/data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "importData", null);
__decorate([
    (0, common_1.Get)('export/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getExportStats", null);
__decorate([
    (0, common_1.Post)('export/schedule'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "scheduleExport", null);
__decorate([
    (0, common_1.Get)('export/history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getExportHistory", null);
__decorate([
    (0, common_1.Get)('cleanup/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCleanupStats", null);
__decorate([
    (0, common_1.Post)('cleanup/run'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "runCleanup", null);
__decorate([
    (0, common_1.Get)('cleanup/history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCleanupHistory", null);
__decorate([
    (0, common_1.Post)('cleanup/schedule'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "scheduleCleanup", null);
__decorate([
    (0, common_1.Get)('tests/integrity'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getIntegrityTests", null);
__decorate([
    (0, common_1.Post)('tests/run'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "runIntegrityTests", null);
__decorate([
    (0, common_1.Get)('tests/history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTestHistory", null);
__decorate([
    (0, common_1.Post)('tests/fix'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "fixIntegrityIssues", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        permissions_service_1.PermissionsService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map