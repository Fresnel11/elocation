import { RoleSeeder } from './role.seeder';
import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
import { CleanupSubCategoriesSeeder } from './cleanup-subcategories.seeder';
import { UserSeeder } from './user.seeder';
import { AdSeeder } from './ad.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';
export declare class SeederService {
    private readonly roleSeeder;
    private readonly categorySeeder;
    private readonly subCategorySeeder;
    private readonly cleanupSubCategoriesSeeder;
    private readonly userSeeder;
    private readonly adSeeder;
    private readonly permissionSeeder;
    private readonly rolePermissionSeeder;
    constructor(roleSeeder: RoleSeeder, categorySeeder: CategorySeeder, subCategorySeeder: SubCategorySeeder, cleanupSubCategoriesSeeder: CleanupSubCategoriesSeeder, userSeeder: UserSeeder, adSeeder: AdSeeder, permissionSeeder: PermissionSeeder, rolePermissionSeeder: RolePermissionSeeder);
    initializeBaseData(): Promise<void>;
    initializeAllData(): Promise<void>;
    private seedRoles;
    private seedCategories;
    private cleanupSubCategories;
    private seedSubCategories;
    private seedUsers;
    private seedPermissions;
    private seedRolePermissions;
    private seedAds;
}
