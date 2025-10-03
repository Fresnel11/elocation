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
        role: import("../roles/entities/role.entity").Role;
        roleId: string;
        isActive: boolean;
        ads: import("../ads/entities/ad.entity").Ad[];
        payments: import("../payments/entities/payment.entity").Payment[];
        requests: import("../requests/entities/request.entity").Request[];
        responses: import("../responses/entities/response.entity").Response[];
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
    updateRolePermissions(roleId: string, permissionIds: string[]): Promise<import("../roles/entities/role.entity").Role>;
}
