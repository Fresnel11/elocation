import { SubCategoriesService } from './subcategories.service';
export declare class SubCategoriesController {
    private readonly subCategoriesService;
    constructor(subCategoriesService: SubCategoriesService);
    findByCategory(categoryId?: string): Promise<import("./entities/subcategory.entity").SubCategory[]>;
}
