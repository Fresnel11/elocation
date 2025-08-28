import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed() {
    const roles = [
      {
        name: UserRole.ADMIN,
        description: 'Administrateur système avec tous les privilèges',
      },
      {
        name: UserRole.OWNER,
        description: 'Propriétaire pouvant publier des annonces',
      },
      {
        name: UserRole.TENANT,
        description: 'Locataire pouvant consulter et réserver',
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        console.log(`Rôle ${roleData.name} créé avec succès`);
      }
    }
  }
}