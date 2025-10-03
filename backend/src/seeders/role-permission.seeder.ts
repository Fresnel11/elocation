import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class RolePermissionSeeder {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    // Récupérer le rôle SUPER_ADMIN
    const superAdminRole = await this.roleRepository.findOne({
      where: { name: UserRole.SUPER_ADMIN },
      relations: ['permissions']
    });

    if (!superAdminRole) {
      console.log('Rôle SUPER_ADMIN non trouvé');
      return;
    }

    // Récupérer toutes les permissions système
    const systemPermissions = await this.permissionRepository.find({
      where: { isSystemPermission: true }
    });

    if (systemPermissions.length === 0) {
      console.log('Aucune permission système trouvée');
      return;
    }

    // Attribuer toutes les permissions système au SUPER_ADMIN s'il ne les a pas déjà
    const existingPermissionIds = superAdminRole.permissions?.map(p => p.id) || [];
    const newPermissions = systemPermissions.filter(p => !existingPermissionIds.includes(p.id));

    if (newPermissions.length > 0) {
      superAdminRole.permissions = [...(superAdminRole.permissions || []), ...newPermissions];
      await this.roleRepository.save(superAdminRole);
      console.log(`${newPermissions.length} permissions attribuées au SUPER_ADMIN`);
    } else {
      console.log('SUPER_ADMIN a déjà toutes les permissions système');
    }
  }
}