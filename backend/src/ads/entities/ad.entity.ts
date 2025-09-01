import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';

@Entity('ads')
export class Ad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  location: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  photos: string[];

  @Column({ nullable: true })
  video: string;

  @Column({ type: 'int', nullable: true })
  bedrooms: number;

  @Column({ type: 'int', nullable: true })
  bathrooms: number;

  @Column({ type: 'int', nullable: true })
  area: number;

  @Column('json', { nullable: true })
  amenities: string[];

  @Column({ nullable: true })
  whatsappLink: string;

  @Column({ nullable: true })
  whatsappNumber: string;

  @ManyToOne(() => User, (user) => user.ads)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Category, (category) => category.ads)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.ads)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategory;

  @Column({ nullable: true })
  subCategoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}