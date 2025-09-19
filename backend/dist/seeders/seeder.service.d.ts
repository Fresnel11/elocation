import { OnModuleInit } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
import { CleanupSubCategoriesSeeder } from './cleanup-subcategories.seeder';
import { UserSeeder } from './user.seeder';
import { AdSeeder } from './ad.seeder';
export declare class SeederService implements OnModuleInit {
    private readonly roleSeeder;
    private readonly categorySeeder;
    private readonly subCategorySeeder;
    private readonly cleanupSubCategoriesSeeder;
    private readonly userSeeder;
    private readonly adSeeder;
    constructor(roleSeeder: RoleSeeder, categorySeeder: CategorySeeder, subCategorySeeder: SubCategorySeeder, cleanupSubCategoriesSeeder: CleanupSubCategoriesSeeder, userSeeder: UserSeeder, adSeeder: AdSeeder);
    onModuleInit(): Promise<void>;
    private seedRoles;
    private seedCategories;
    private cleanupSubCategories;
    private seedSubCategories;
    private seedUsers;
    private seedAds;
}
