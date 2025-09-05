import { CategorySeeder } from './category.seeder';
import { SubCategorySeeder } from './subcategory.seeder';
import { UpdateCoordinatesSeeder } from './update-coordinates.seeder';
export declare class InitDataController {
    private readonly categorySeeder;
    private readonly subCategorySeeder;
    private readonly updateCoordinatesSeeder;
    constructor(categorySeeder: CategorySeeder, subCategorySeeder: SubCategorySeeder, updateCoordinatesSeeder: UpdateCoordinatesSeeder);
    seedData(): Promise<{
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
