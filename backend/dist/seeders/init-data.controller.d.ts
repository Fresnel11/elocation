import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
export declare class InitDataController {
    private readonly categorySeeder;
    private readonly subCategorySeeder;
    constructor(categorySeeder: CategorySeeder, subCategorySeeder: SubCategorySeeder);
    seedData(): Promise<{
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
    }>;
}
