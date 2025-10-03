import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
import { UpdateCoordinatesSeeder } from './update-coordinates.seeder';
import { UserSeeder } from './user.seeder';
import { RoleSeeder } from './role.seeder';
export declare class InitDataController {
    private readonly categorySeeder;
    private readonly subCategorySeeder;
    private readonly updateCoordinatesSeeder;
    private readonly userSeeder;
    private readonly roleSeeder;
    constructor(categorySeeder: CategorySeeder, subCategorySeeder: SubCategorySeeder, updateCoordinatesSeeder: UpdateCoordinatesSeeder, userSeeder: UserSeeder, roleSeeder: RoleSeeder);
    seedData(): Promise<{
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: string;
        message?: undefined;
    }>;
    seedAdmin(): Promise<{
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: string;
        message?: undefined;
    }>;
    updateCoordinates(): Promise<{
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: string;
        message?: undefined;
    }>;
}
