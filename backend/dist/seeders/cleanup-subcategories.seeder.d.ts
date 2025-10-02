import { Repository } from 'typeorm';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
export declare class CleanupSubCategoriesSeeder {
    private subCategoryRepository;
    constructor(subCategoryRepository: Repository<SubCategory>);
    cleanup(): Promise<void>;
}
