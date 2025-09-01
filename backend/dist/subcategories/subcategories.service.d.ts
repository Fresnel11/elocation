import { Repository } from 'typeorm';
import { SubCategory } from './entities/subcategory.entity';
export declare class SubCategoriesService {
    private subCategoryRepository;
    constructor(subCategoryRepository: Repository<SubCategory>);
    findAll(): Promise<SubCategory[]>;
    findByCategory(categoryId: string): Promise<SubCategory[]>;
}
