import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly roleSeeder: RoleSeeder) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await this.seedRoles();
    }
  }

  private async seedRoles() {
    try {
      await this.roleSeeder.seed();
      console.log('Seeding des rôles terminé');
    } catch (error) {
      console.error('Erreur lors du seeding des rôles:', error);
    }
  }
}