import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    const permissions = [
      {
        name: 'create_user',
        description: 'Créer des utilisateurs',
        isSystemPermission: true,
      },
      {
        name: 'manage_users',
        description: 'Gérer les utilisateurs',
        isSystemPermission: true,
      },
      {
        name: 'manage_ads',
        description: 'Gérer les annonces',
        isSystemPermission: true,
      },
      {
        name: 'manage_bookings',
        description: 'Gérer les réservations',
        isSystemPermission: true,
      },
      {
        name: 'view_analytics',
        description: 'Voir les analytics',
        isSystemPermission: true,
      },
    ];

    for (const permissionData of permissions) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: permissionData.name },
      });

      if (!existingPermission) {
        const permission = this.permissionRepository.create(permissionData);
        await this.permissionRepository.save(permission);
        console.log(`Permission ${permissionData.name} créée avec succès`);
      }
    }
  }
}