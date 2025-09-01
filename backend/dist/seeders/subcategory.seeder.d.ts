import { Repository } from 'typeorm';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { Category } from '../categories/entities/category.entity';
export declare class SubCategorySeeder {
    private subCategoryRepository;
    private categoryRepository;
    constructor(subCategoryRepository: Repository<SubCategory>, categoryRepository: Repository<Category>);
    seed(): Promise<void>;
}
