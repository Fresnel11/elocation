import { Controller, Get, Query } from '@nestjs/common';
import { SubCategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Get()
  async findByCategory(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.subCategoriesService.findByCategory(categoryId);
    }
    return this.subCategoriesService.findAll();
  }
}