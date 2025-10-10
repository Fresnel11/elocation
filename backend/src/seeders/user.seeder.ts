import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed() {
    // Créer le super admin s'il n'existe pas
    const existingSuperAdmin = await this.userRepository.findOne({ where: { email: 'fresnel@superadmin.com' } });
    if (!existingSuperAdmin) {
      const superAdminRole = await this.roleRepository.findOne({ where: { name: UserRole.SUPER_ADMIN } });
      
      if (superAdminRole) {
        const superAdminData = {
          firstName: 'Fresnel',
          lastName: 'SuperAdmin',
          email: 'fresnel@superadmin.com',
          phone: '+22900000000',
          password: await bcrypt.hash('superadmin2003', 10),
          role: superAdminRole,
          isActive: true,
          isVerified: true,
        };
        
        const superAdmin = this.userRepository.create(superAdminData);
        await this.userRepository.save(superAdmin);
        console.log('Super Admin Fresnel créé avec succès');
      }
    }

    // Vérifier si les utilisateurs de test existent déjà
    const existingTestUser = await this.userRepository.findOne({ where: { email: 'marie.adjovi@example.com' } });
    if (existingTestUser) {
      console.log('Les utilisateurs de test existent déjà, seeding ignoré');
      return;
    }

    const userRole = await this.roleRepository.findOne({ where: { name: UserRole.USER } });

    if (!userRole) {
      console.log('Rôle user non trouvé, seeding des utilisateurs ignoré');
      return;
    }

    const usersData = [
      {
        firstName: 'Marie',
        lastName: 'Adjovi',
        email: 'marie.adjovi@example.com',
        phone: '+22997123456',
        password: await bcrypt.hash('password123', 10),
        role: userRole,
        isActive: true,
      },
      {
        firstName: 'Jean',
        lastName: 'Koudjo',
        email: 'jean.koudjo@example.com',
        phone: '+22997234567',
        password: await bcrypt.hash('password123', 10),
        role: userRole,
        isActive: true,
      },
      {
        firstName: 'Fatou',
        lastName: 'Sanni',
        email: 'fatou.sanni@example.com',
        phone: '+22997345678',
        password: await bcrypt.hash('password123', 10),
        role: userRole,
        isActive: true,
      },
      {
        firstName: 'Pierre',
        lastName: 'Dossou',
        email: 'pierre.dossou@example.com',
        phone: '+22997456789',
        password: await bcrypt.hash('password123', 10),
        role: userRole,
        isActive: true,
      },
      {
        firstName: 'Aminata',
        lastName: 'Traore',
        email: 'aminata.traore@example.com',
        phone: '+22997567890',
        password: await bcrypt.hash('password123', 10),
        role: userRole,
        isActive: true,
      },
    ];

    for (const userData of usersData) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      console.log(`Utilisateur ${userData.firstName} ${userData.lastName} créé avec succès`);
    }
  }
}