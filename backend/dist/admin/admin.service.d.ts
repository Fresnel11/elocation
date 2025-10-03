import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { SystemSetting } from './entities/system-setting.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
export declare class AdminService {
    private userRepository;
    private adRepository;
    private bookingRepository;
    private systemSettingRepository;
    private activityLogRepository;
    private roleRepository;
    private permissionRepository;
    constructor(userRepository: Repository<User>, adRepository: Repository<Ad>, bookingRepository: Repository<Booking>, systemSettingRepository: Repository<SystemSetting>, activityLogRepository: Repository<ActivityLog>, roleRepository: Repository<Role>, permissionRepository: Repository<Permission>);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalAds: number;
        totalBookings: number;
        activeUsers: number;
        inactiveAds: number;
        recentUsers: User[];
    }>;
    getUsersStats(): Promise<{
        usersByRole: any[];
        usersThisMonth: number;
    }>;
    getAllUsers(page?: number, limit?: number, search?: string, role?: string, status?: string): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserDetails(userId: string): Promise<{
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
        role: Role;
        roleId: string;
        isActive: boolean;
        ads: Ad[];
        payments: import("../payments/entities/payment.entity").Payment[];
        requests: import("../requests/entities/request.entity").Request[];
        responses: import("../responses/entities/response.entity").Response[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStatus(userId: string, isActive: boolean): Promise<User>;
    updateUserRole(userId: string, roleId: string): Promise<User>;
    deleteUser(userId: string): Promise<void>;
    getAllAds(page?: number, limit?: number, search?: string, status?: string, category?: string): Promise<{
        data: Ad[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateAdStatus(adId: string, status: string, reason?: string): Promise<Ad>;
    deleteAd(adId: string): Promise<void>;
    getAllBookings(page?: number, limit?: number, status?: string, search?: string): Promise<{
        data: Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateBookingStatus(bookingId: string, status: string, reason?: string): Promise<Booking>;
    getSystemSettings(): Promise<SystemSetting[]>;
    getPublicSettings(): Promise<SystemSetting[]>;
    updateSystemSetting(key: string, value: string, type?: string): Promise<SystemSetting>;
    initializeDefaultSettings(): Promise<void>;
    getActivityLogs(page?: number, limit?: number, userId?: string, action?: string): Promise<{
        data: ActivityLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    logActivity(action: string, entity: string, entityId?: string, userId?: string, oldData?: any, newData?: any, ipAddress?: string, userAgent?: string): Promise<ActivityLog>;
    getSystemStats(): Promise<{
        totalLogs: number;
        recentLogs: number;
    }>;
    getAnalytics(): Promise<{
        usersGrowth: any[];
        adsGrowth: any[];
        topCategories: any[];
        bookingsStats: any[];
    }>;
    createUser(userData: any): Promise<User>;
    getAllPermissions(): Promise<Permission[]>;
    createPermission(permissionData: any): Promise<Permission>;
    deletePermission(permissionId: string): Promise<void>;
    getRolesWithPermissions(): Promise<Role[]>;
    updateRolePermissions(roleId: string, permissionIds: string[]): Promise<Role>;
}
