import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { SystemSetting } from './entities/system-setting.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(SystemSetting)
    private systemSettingRepository: Repository<SystemSetting>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalAds,
      totalBookings,
      activeUsers,
      pendingAds,
      recentUsers,
    ] = await Promise.all([
      this.userRepository.count(),
      this.adRepository.count(),
      this.bookingRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.adRepository.count({ where: { isActive: false } }),
      this.userRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['role'],
      }),
    ]);

    return {
      totalUsers,
      totalAds,
      totalBookings,
      activeUsers,
      inactiveAds: pendingAds,
      recentUsers,
    };
  }

  async getUsersStats() {
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .select('role.name', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('role.name')
      .getRawMany();

    const usersThisMonth = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startOfMonth', {
        startOfMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      })
      .getCount();

    return {
      usersByRole,
      usersThisMonth,
    };
  }

  async getAllUsers(page = 1, limit = 20, search?: string, role?: string, status?: string) {
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .orderBy('user.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (role) {
      query.andWhere('role.name = :role', { role });
    }

    if (status === 'active') {
      query.andWhere('user.isActive = :isActive', { isActive: true });
    } else if (status === 'inactive') {
      query.andWhere('user.isActive = :isActive', { isActive: false });
    }

    const [users, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'ads', 'payments'],
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const userAdsCount = await this.adRepository.count({ where: { user: { id: userId } } });
    const userBookingsCount = await this.bookingRepository.count({ 
      where: [{ tenant: { id: userId } }, { owner: { id: userId } }] 
    });

    return {
      ...user,
      stats: {
        adsCount: userAdsCount,
        bookingsCount: userBookingsCount,
      },
    };
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    await this.userRepository.update(userId, { isActive });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role']
    });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  }

  async updateUserRole(userId: string, roleId: string) {
    await this.userRepository.update(userId, { roleId });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role']
    });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  }

  async deleteUser(userId: string) {
    // Vérifier s'il y a des dépendances
    const adsCount = await this.adRepository.count({ where: { user: { id: userId } } });
    const bookingsCount = await this.bookingRepository.count({ 
      where: [{ tenant: { id: userId } }, { owner: { id: userId } }] 
    });

    if (adsCount > 0 || bookingsCount > 0) {
      throw new Error('Impossible de supprimer un utilisateur avec des annonces ou réservations actives');
    }

    await this.userRepository.delete(userId);
  }

  // Gestion des annonces
  async getAllAds(page = 1, limit = 20, search?: string, status?: string, category?: string) {
    const query = this.adRepository.createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .leftJoinAndSelect('ad.category', 'category')
      .orderBy('ad.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(ad.title LIKE :search OR ad.description LIKE :search OR ad.location LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status === 'active') {
      query.andWhere('ad.isActive = :isActive', { isActive: true });
    } else if (status === 'inactive') {
      query.andWhere('ad.isActive = :isActive', { isActive: false });
    }

    if (category) {
      query.andWhere('category.id = :category', { category });
    }

    const [ads, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: ads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateAdStatus(adId: string, status: string, reason?: string) {
    const isActive = status === 'active';
    await this.adRepository.update(adId, { isActive });
    return this.adRepository.findOne({ 
      where: { id: adId },
      relations: ['user', 'category']
    });
  }

  async deleteAd(adId: string) {
    // Vérifier s'il y a des réservations actives
    const activeBookings = await this.bookingRepository.count({
      where: { ad: { id: adId }, status: BookingStatus.CONFIRMED }
    });

    if (activeBookings > 0) {
      throw new Error('Impossible de supprimer une annonce avec des réservations actives');
    }

    await this.adRepository.delete(adId);
  }

  // Gestion des réservations
  async getAllBookings(page = 1, limit = 20, status?: string, search?: string) {
    const query = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.ad', 'ad')
      .leftJoinAndSelect('booking.tenant', 'tenant')
      .leftJoinAndSelect('booking.owner', 'owner')
      .orderBy('booking.createdAt', 'DESC');

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(ad.title LIKE :search OR tenant.firstName LIKE :search OR tenant.lastName LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [bookings, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateBookingStatus(bookingId: string, status: string, reason?: string) {
    const bookingStatus = status as BookingStatus;
    const updateData: any = { status: bookingStatus };
    if (reason) {
      updateData.cancellationReason = reason;
    }
    
    await this.bookingRepository.update(bookingId, updateData);
    return this.bookingRepository.findOne({ 
      where: { id: bookingId },
      relations: ['ad', 'tenant', 'owner']
    });
  }

  // Gestion des paramètres système
  async getSystemSettings() {
    return this.systemSettingRepository.find({
      order: { key: 'ASC' }
    });
  }

  async getPublicSettings() {
    return this.systemSettingRepository.find({
      where: { isPublic: true },
      order: { key: 'ASC' }
    });
  }

  async updateSystemSetting(key: string, value: string, type = 'string') {
    let setting = await this.systemSettingRepository.findOne({ where: { key } });
    
    if (setting) {
      setting.value = value;
      setting.type = type;
    } else {
      setting = this.systemSettingRepository.create({ key, value, type });
    }
    
    return this.systemSettingRepository.save(setting);
  }

  async initializeDefaultSettings() {
    const defaultSettings = [
      { key: 'app_name', value: 'eLocation', type: 'string', isPublic: true, description: 'Nom de l\'application' },
      { key: 'app_description', value: 'Plateforme de location au Bénin', type: 'string', isPublic: true, description: 'Description de l\'application' },
      { key: 'commission_rate', value: '5', type: 'number', isPublic: false, description: 'Taux de commission (%)' },
      { key: 'max_photos_per_ad', value: '5', type: 'number', isPublic: true, description: 'Nombre max de photos par annonce' },
      { key: 'auto_approve_ads', value: 'false', type: 'boolean', isPublic: false, description: 'Approbation automatique des annonces' },
      { key: 'maintenance_mode', value: 'false', type: 'boolean', isPublic: true, description: 'Mode maintenance' },
      { key: 'contact_email', value: 'contact@elocation.bj', type: 'string', isPublic: true, description: 'Email de contact' },
    ];

    for (const setting of defaultSettings) {
      const exists = await this.systemSettingRepository.findOne({ where: { key: setting.key } });
      if (!exists) {
        await this.systemSettingRepository.save(setting);
      }
    }
  }

  // Gestion des logs d'activité
  async getActivityLogs(page = 1, limit = 50, userId?: string, action?: string) {
    const query = this.activityLogRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC');

    if (userId) {
      query.andWhere('log.userId = :userId', { userId });
    }

    if (action) {
      query.andWhere('log.action = :action', { action });
    }

    const [logs, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async logActivity(action: string, entity: string, entityId?: string, userId?: string, oldData?: any, newData?: any, ipAddress?: string, userAgent?: string) {
    const log = this.activityLogRepository.create({
      action,
      entity,
      entityId,
      userId,
      oldData,
      newData,
      ipAddress,
      userAgent,
    });

    return this.activityLogRepository.save(log);
  }

  async getSystemStats() {
    const [totalLogs, recentLogs] = await Promise.all([
      this.activityLogRepository.count(),
      this.activityLogRepository.count({
        where: {
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
        }
      })
    ]);

    return {
      totalLogs,
      recentLogs,
    };
  }

  async getAnalytics() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Évolution mensuelle des utilisateurs
    const usersGrowth = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE_FORMAT(user.createdAt, "%Y-%m")', 'month')
      .addSelect('COUNT(user.id)', 'count')
      .where('user.createdAt >= :sixMonthsAgo', {
        sixMonthsAgo: new Date(now.getFullYear(), now.getMonth() - 6, 1),
      })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Évolution des annonces
    const adsGrowth = await this.adRepository
      .createQueryBuilder('ad')
      .select('DATE_FORMAT(ad.createdAt, "%Y-%m")', 'month')
      .addSelect('COUNT(ad.id)', 'count')
      .where('ad.createdAt >= :sixMonthsAgo', {
        sixMonthsAgo: new Date(now.getFullYear(), now.getMonth() - 6, 1),
      })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Top catégories
    const topCategories = await this.adRepository
      .createQueryBuilder('ad')
      .leftJoin('ad.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(ad.id)', 'count')
      .groupBy('category.id')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    // Statistiques de réservations
    const bookingsStats = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('booking.status', 'status')
      .addSelect('COUNT(booking.id)', 'count')
      .groupBy('booking.status')
      .getRawMany();

    return {
      usersGrowth,
      adsGrowth,
      topCategories,
      bookingsStats,
    };
  }

  async createUser(userData: any) {
    const { firstName, lastName, email, phone, password, role } = userData;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Récupérer le rôle
    const userRole = await this.roleRepository.findOne({ where: { name: role } });
    if (!userRole) {
      throw new Error('Rôle invalide');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      isActive: true, // Activé par défaut pour les utilisateurs créés par admin
    });

    return this.userRepository.save(user);
  }

  // Gestion des permissions
  async getAllPermissions() {
    return this.permissionRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async createPermission(permissionData: any) {
    const { name, description } = permissionData;
    
    const existingPermission = await this.permissionRepository.findOne({ where: { name } });
    if (existingPermission) {
      throw new Error('Une permission avec ce nom existe déjà');
    }

    const permission = this.permissionRepository.create({
      name,
      description,
      isSystemPermission: false,
    });

    return this.permissionRepository.save(permission);
  }

  async deletePermission(permissionId: string) {
    const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
    if (!permission) {
      throw new Error('Permission non trouvée');
    }

    if (permission.isSystemPermission) {
      throw new Error('Impossible de supprimer une permission système');
    }

    await this.permissionRepository.delete(permissionId);
  }

  async getRolesWithPermissions() {
    return this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .orderBy('role.name', 'ASC')
      .getMany();
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions']
    });

    if (!role) {
      throw new Error('Rôle non trouvé');
    }

    const permissions = await this.permissionRepository.findByIds(permissionIds);
    role.permissions = permissions;
    
    return this.roleRepository.save(role);
  }
}