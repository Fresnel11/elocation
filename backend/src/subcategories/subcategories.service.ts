import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subcategory.entity';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async findAll(): Promise<SubCategory[]> {
    return this.subCategoryRepository.find({
      where: { isActive: true },
      relations: ['category'],
    });
  }

  async findByCategory(categoryId: string): Promise<SubCategory[]> {
    return this.subCategoryRepository.find({
      where: { categoryId, isActive: true },
      relations: ['category'],
    });
  }
}