import { AdminService } from './admin.service';
import { PermissionsService } from '../permissions/permissions.service';
export declare class AdminController {
    private readonly adminService;
    private readonly permissionsService;
    constructor(adminService: AdminService, permissionsService: PermissionsService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalAds: number;
        totalBookings: number;
        activeUsers: number;
        inactiveAds: number;
        recentUsers: import("../users/entities/user.entity").User[];
    }>;
    getUsersStats(): Promise<{
        usersByRole: any[];
        usersThisMonth: number;
    }>;
    getAnalytics(): Promise<{
        usersGrowth: any[];
        adsGrowth: any[];
        topCategories: any[];
        bookingsStats: any[];
    }>;
    getAllUsers(page?: number, limit?: number, search?: string, role?: string, status?: string): Promise<{
        data: import("../users/entities/user.entity").User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserDetails(id: string): Promise<{
        stats: {
            adsCount: number;
            bookingsCount: number;
        };
        id: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        whatsappNumber: string | null;
        password: string | null;
        googleId: string | null;
        profilePicture: string | null;
        birthDate: Date | null;
        lastLogin: Date | null;
        otpCode: string | null;
        otpExpiresAt: Date | null;
        resetPasswordOtp: string | null;
        resetPasswordOtpExpiresAt: Date | null;
        referralCode: string | null;
        role: import("../roles/entities/role.entity").Role;
        roleId: string;
        isActive: boolean;
        ads: import("../ads/entities/ad.entity").Ad[];
        payments: import("../payments/entities/payment.entity").Payment[];
        requests: import("../requests/entities/request.entity").Request[];
        responses: import("../responses/entities/response.entity").Response[];
        favorites: import("../favorites/entities/favorite.entity").Favorite[];
        profile: import("../users/entities/user-profile.entity").UserProfile;
        loyaltyPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStatus(id: string, isActive: boolean): Promise<import("../users/entities/user.entity").User>;
    updateUserRole(id: string, roleId: string): Promise<import("../users/entities/user.entity").User>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getAllAds(page?: number, limit?: number, search?: string, status?: string, category?: string): Promise<{
        data: import("../ads/entities/ad.entity").Ad[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateAdStatus(id: string, status: string, reason?: string): Promise<import("../ads/entities/ad.entity").Ad>;
    deleteAd(id: string): Promise<{
        message: string;
    }>;
    getAllBookings(page?: number, limit?: number, status?: string, search?: string): Promise<{
        data: import("../bookings/entities/booking.entity").Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateBookingStatus(id: string, status: string, reason?: string): Promise<import("../bookings/entities/booking.entity").Booking>;
    getSystemSettings(): Promise<import("./entities/system-setting.entity").SystemSetting[]>;
    updateSystemSetting(key: string, value: string, type?: string): Promise<import("./entities/system-setting.entity").SystemSetting>;
    initializeDefaultSettings(): Promise<{
        message: string;
    }>;
    getActivityLogs(page?: number, limit?: number, userId?: string, action?: string): Promise<{
        data: import("./entities/activity-log.entity").ActivityLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSystemStats(): Promise<{
        totalLogs: number;
        recentLogs: number;
    }>;
    checkPermission(permission: string, req: any): Promise<{
        hasPermission: boolean;
    }>;
    createUser(userData: any, req: any): Promise<import("../users/entities/user.entity").User>;
    getAllPermissions(): Promise<import("../permissions/entities/permission.entity").Permission[]>;
    createPermission(permissionData: any): Promise<import("../permissions/entities/permission.entity").Permission>;
    deletePermission(id: string): Promise<{
        message: string;
    }>;
    getRolesWithPermissions(): Promise<import("../roles/entities/role.entity").Role[]>;
    createCategory(categoryData: any): Promise<import("../categories/entities/category.entity").Category[]>;
    updateCategory(id: string, categoryData: any): Promise<import("../categories/entities/category.entity").Category>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
    createSubCategory(subCategoryData: any): Promise<import("../subcategories/entities/subcategory.entity").SubCategory[]>;
    updateSubCategory(id: string, subCategoryData: any): Promise<import("../subcategories/entities/subcategory.entity").SubCategory>;
    deleteSubCategory(id: string): Promise<{
        message: string;
    }>;
    updateRolePermissions(roleId: string, permissionIds: string[]): Promise<import("../roles/entities/role.entity").Role>;
    getPendingReviews(): Promise<import("../reviews/entities/review.entity").Review[]>;
    approveReview(id: string): Promise<import("../reviews/entities/review.entity").Review>;
    rejectReview(id: string): Promise<import("../reviews/entities/review.entity").Review>;
    getReports(status?: string, type?: string, page?: number, limit?: number): Promise<{
        data: import("../reports/entities/report.entity").Report[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    resolveReport(id: string, action: string): Promise<import("../reports/entities/report.entity").Report>;
    dismissReport(id: string): Promise<import("../reports/entities/report.entity").Report>;
    getEmailTemplates(): Promise<import("../email-templates/entities/email-template.entity").EmailTemplate[]>;
    updateEmailTemplate(id: string, templateData: any): Promise<import("../email-templates/entities/email-template.entity").EmailTemplate>;
    initializeEmailTemplates(): Promise<{
        message: string;
    }>;
    enableMaintenance(message?: string): Promise<{
        message: string;
    }>;
    disableMaintenance(): Promise<{
        message: string;
    }>;
    getMaintenanceStatus(): Promise<{
        isEnabled: boolean;
        message: string;
    }>;
    createBackup(): Promise<{
        name: string;
        createdAt: Date;
        size: string;
        tables: {
            users: number;
            ads: number;
            bookings: number;
        };
    }>;
    listBackups(): Promise<{
        name: string;
        createdAt: Date;
        size: string;
        status: string;
    }[]>;
    getFinancialOverview(startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
        totalCommissions: number;
        totalBookings: number;
        averageBookingValue: number;
        paymentMethods: {
            method: string;
            count: number;
            amount: number;
        }[];
        topCategories: {
            category: string;
            revenue: number;
            bookings: number;
        }[];
        period: {
            start: Date;
            end: Date;
        };
    }>;
    getRevenueChart(period?: string): Promise<{
        month: string;
        revenue: number;
        commissions: number;
        bookings: number;
    }[]>;
    getCommissions(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            bookingId: string;
            amount: number;
            rate: number;
            status: string;
            createdAt: Date;
            booking: {
                ad: {
                    title: string;
                    user: {
                        firstName: string;
                        lastName: string;
                    };
                };
                totalPrice: number;
            };
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMediaFiles(type?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            filename: string;
            originalName: string;
            type: string;
            size: number;
            url: string;
            uploadedAt: Date;
            usedBy: {
                type: string;
                id: string;
                title: string;
            };
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    deleteMediaFile(filename: string): Promise<{
        message: string;
    }>;
    getMediaStats(): Promise<{
        totalFiles: number;
        totalSize: number;
        imageFiles: number;
        videoFiles: number;
        unusedFiles: number;
        storageUsed: number;
    }>;
    getSupportTickets(status?: string, priority?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            subject: string;
            description: string;
            status: string;
            priority: string;
            category: string;
            createdAt: Date;
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
            assignedTo: {
                id: string;
                firstName: string;
                lastName: string;
            };
            _messageCount: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTicketDetails(id: string): Promise<{
        id: string;
        subject: string;
        description: string;
        status: string;
        priority: string;
        category: string;
        createdAt: Date;
        user: {
            firstName: string;
            lastName: string;
        };
        messages: {
            id: string;
            content: string;
            isFromAdmin: boolean;
            createdAt: Date;
            author: {
                firstName: string;
                lastName: string;
            };
        }[];
    }>;
    replyToTicket(id: string, message: string, req: any): Promise<{
        id: string;
        content: string;
        isFromAdmin: boolean;
        createdAt: Date;
        author: {
            firstName: string;
            lastName: string;
        };
    }>;
    updateTicketStatus(id: string, status: string): Promise<{
        message: string;
    }>;
    assignTicket(id: string, adminId: string): Promise<{
        message: string;
    }>;
    getAuditTrail(entityType?: string, entityId?: string, userId?: string, action?: string, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            action: string;
            entity: string;
            entityId: string;
            userId: string;
            timestamp: Date;
            ipAddress: string;
            userAgent: string;
            changes: {
                before: {
                    status: string;
                    title: string;
                };
                after: {
                    status: string;
                    title: string;
                };
            };
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: string;
            };
            metadata: {
                source: string;
                sessionId: string;
                requestId: string;
            };
        }[];
        total: number;
        page: any;
        limit: any;
        totalPages: number;
        summary: {
            totalActions: number;
            uniqueUsers: number;
            uniqueEntities: number;
            actionBreakdown: Record<string, number>;
        };
    }>;
    getEntityAuditHistory(entityType: string, entityId: string): Promise<{
        entityType: string;
        entityId: string;
        history: {
            id: string;
            action: string;
            timestamp: Date;
            user: {
                firstName: string;
                lastName: string;
                role: string;
            };
            changes: {
                field: string;
                oldValue: string;
                newValue: string;
            };
            reason: string;
        }[];
        summary: {
            createdAt: Date;
            lastModified: Date;
            totalChanges: number;
            contributors: number;
        };
    }>;
    getSystemHealth(): Promise<{
        status: string;
        uptime: number;
        version: string;
        environment: string;
        services: {
            database: {
                status: string;
                responseTime: number;
            };
            redis: {
                status: string;
                responseTime: number;
            };
            storage: {
                status: string;
                usage: number;
            };
            email: {
                status: string;
                responseTime: number;
            };
        };
        resources: {
            cpu: {
                usage: number;
                cores: number;
            };
            memory: {
                usage: number;
                total: number;
                used: number;
            };
            disk: {
                usage: number;
                total: number;
                used: number;
            };
            network: {
                inbound: number;
                outbound: number;
            };
        };
        lastCheck: Date;
    }>;
    getPerformanceMetrics(period?: string): Promise<{
        period: string;
        metrics: {
            timestamp: Date;
            responseTime: number;
            requests: number;
            errors: number;
            cpuUsage: number;
            memoryUsage: number;
            activeUsers: number;
        }[];
        summary: {
            avgResponseTime: number;
            totalRequests: number;
            totalErrors: number;
            errorRate: number;
            peakCpu: number;
            peakMemory: number;
            peakUsers: number;
        };
    }>;
    getErrorLogs(severity?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            timestamp: Date;
            severity: string;
            message: string;
            source: string;
            stack: string;
            userId: string;
            requestId: string;
            resolved: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getActiveAlerts(): Promise<{
        id: string;
        type: string;
        severity: string;
        title: string;
        message: string;
        createdAt: Date;
        acknowledged: boolean;
        threshold: number;
        currentValue: number;
    }[]>;
    acknowledgeAlert(id: string): Promise<{
        message: string;
    }>;
    getActiveSessions(page?: number, limit?: number, userId?: string): Promise<{
        data: {
            id: string;
            userId: string;
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                role: string;
            };
            deviceInfo: string;
            ipAddress: string;
            location: string;
            loginTime: Date;
            lastActivity: Date;
            isActive: boolean;
            sessionDuration: number;
            actions: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    terminateSession(sessionId: string): Promise<{
        message: string;
    }>;
    terminateAllUserSessions(userId: string): Promise<{
        message: string;
    }>;
    getSessionStats(): Promise<{
        totalActiveSessions: number;
        uniqueUsers: number;
        averageSessionDuration: number;
        peakConcurrentSessions: number;
        sessionsByDevice: {
            desktop: number;
            mobile: number;
            tablet: number;
        };
        sessionsByLocation: {
            Cotonou: number;
            'Porto-Novo': number;
            Parakou: number;
            Autres: number;
        };
        recentLogins: number;
        suspiciousActivity: number;
    }>;
    exportData(tables?: string): Promise<{
        success: boolean;
        data: {
            metadata: {
                exportDate: string;
                version: string;
                tables: string[];
                totalRecords: number;
            };
            data: {};
        };
        downloadUrl: string;
        size: number;
    }>;
    importData(file: any): Promise<{
        success: boolean;
        imported: {};
        errors: any[];
        summary: {
            totalRecords: number;
            successfulImports: number;
            failedImports: number;
        };
    }>;
    getExportStats(): Promise<{
        totalExports: number;
        lastExportDate: string;
        averageExportSize: string;
        exportsByMonth: {
            month: string;
            count: number;
        }[];
        tableStats: {
            users: {
                records: number;
                size: string;
            };
            ads: {
                records: number;
                size: string;
            };
            bookings: {
                records: number;
                size: string;
            };
            categories: {
                records: number;
                size: string;
            };
            reviews: {
                records: number;
                size: string;
            };
        };
    }>;
    scheduleExport(scheduleData: any): Promise<{
        success: boolean;
        scheduleId: string;
        nextExecution: string;
        frequency: any;
        tables: any;
    }>;
    getExportHistory(): Promise<{
        exports: {
            id: string;
            date: string;
            tables: string[];
            size: string;
            records: number;
            status: string;
            downloadUrl: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCleanupStats(): Promise<{
        obsoleteData: {
            expiredSessions: number;
            oldLogs: number;
            unusedMedia: number;
            expiredBookings: number;
            inactiveUsers: number;
            deletedAds: number;
        };
        storageImpact: {
            totalSize: string;
            reclaimableSpace: string;
            mediaFiles: string;
            logFiles: string;
        };
        lastCleanup: string;
        recommendations: {
            type: string;
            count: number;
            description: string;
        }[];
    }>;
    runCleanup(cleanupData: any): Promise<{
        success: boolean;
        dryRun: any;
        cleaned: {};
        errors: any[];
        summary: {
            totalItems: number;
            totalSize: number;
            duration: number;
        };
    }>;
    getCleanupHistory(): Promise<{
        cleanups: {
            id: string;
            date: string;
            types: string[];
            itemsCleaned: number;
            spaceReclaimed: string;
            duration: string;
            status: string;
            triggeredBy: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    scheduleCleanup(scheduleData: any): Promise<{
        success: boolean;
        scheduleId: string;
        nextExecution: string;
        frequency: any;
        types: any;
        olderThan: any;
    }>;
    getIntegrityTests(): Promise<{
        availableTests: {
            id: string;
            name: string;
            description: string;
            category: string;
            severity: string;
        }[];
        lastRun: string;
        totalIssues: number;
        criticalIssues: number;
    }>;
    runIntegrityTests(testData: any): Promise<{
        success: boolean;
        testResults: {};
        summary: {
            totalTests: any;
            passed: number;
            failed: number;
            issues: number;
            autoFixed: number;
        };
        startTime: string;
        duration: number;
    }>;
    getTestHistory(): Promise<{
        tests: {
            id: string;
            date: string;
            testsRun: number;
            issuesFound: number;
            issuesFixed: number;
            duration: string;
            status: string;
            triggeredBy: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    fixIntegrityIssues(fixData: any): Promise<{
        success: boolean;
        fixed: any;
        failed: number;
        results: any;
    }>;
}
