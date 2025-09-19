import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Category } from '../categories/entities/category.entity';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { Ad } from '../ads/entities/ad.entity';
import { User } from '../users/entities/user.entity';
import { RoleSeeder } from './role.seeder';
import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
import { CleanupSubCategoriesSeeder } from './cleanup-subcategories.seeder';
import { UserSeeder } from './user.seeder';
import { AdSeeder } from './ad.seeder';
import { SeederService } from './seeder.service';
import { InitDataController } from './init-data.controller';
import { UpdateCoordinatesSeeder } from './update-coordinates.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Category, SubCategory, Ad, User])],
  controllers: [InitDataController],
  providers: [RoleSeeder, CategorySeeder, SubCategorySeeder, CleanupSubCategoriesSeeder, UserSeeder, AdSeeder, SeederService, UpdateCoordinatesSeeder],
  exports: [SeederService, UpdateCoordinatesSeeder],
})
export class SeederModule {}