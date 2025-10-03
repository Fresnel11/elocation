import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions'],
    });

    if (!user) return false;

    // Super admin a toutes les permissions
    if (user.role?.name === 'super_admin') return true;

    // Vérifier si le rôle de l'utilisateur a la permission
    return user.role?.permissions?.some(permission => permission.name === permissionName) || false;
  }

  async grantPermissionToRole(roleId: string, permissionName: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    const permission = await this.permissionRepository.findOne({
      where: { name: permissionName },
    });

    if (role && permission) {
      if (!role.permissions) role.permissions = [];
      
      const hasPermission = role.permissions.some(p => p.id === permission.id);
      if (!hasPermission) {
        role.permissions.push(permission);
        await this.roleRepository.save(role);
      }
    }
  }

  async revokePermissionFromRole(roleId: string, permissionName: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (role && role.permissions) {
      role.permissions = role.permissions.filter(p => p.name !== permissionName);
      await this.roleRepository.save(role);
    }
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    return role?.permissions || [];
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
      order: { name: 'ASC' }
    });
  }
}