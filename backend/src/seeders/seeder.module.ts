import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Category } from '../categories/entities/category.entity';
import { Ad } from '../ads/entities/ad.entity';
import { User } from '../users/entities/user.entity';
import { RoleSeeder } from './role.seeder';
import { CategorySeeder } from './category.seeder';
import { UserSeeder } from './user.seeder';
import { AdSeeder } from './ad.seeder';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Category, Ad, User])],
  providers: [RoleSeeder, CategorySeeder, UserSeeder, AdSeeder, SeederService],
  exports: [SeederService],
})
export class SeederModule {}