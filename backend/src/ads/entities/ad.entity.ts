import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';
import { Review } from '../../reviews/entities/review.entity';
import { AdPublisherRole } from '../../common/enums/ad-publisher-role.enum';

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

  @Column('json')
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

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  // Champs génériques pour différentes catégories
  @Column({ nullable: true })
  brand: string; // Marque (véhicules, électroménager, etc.)

  @Column({ nullable: true })
  model: string; // Modèle

  @Column({ type: 'int', nullable: true })
  year: number; // Année (véhicules, électroménager)

  @Column({ nullable: true })
  condition: string; // État (neuf, bon, usagé)

  @Column({ nullable: true })
  color: string; // Couleur

  @Column({ nullable: true })
  fuel: string; // Carburant (véhicules)

  @Column({ nullable: true })
  transmission: string; // Transmission (véhicules)

  @Column({ type: 'int', nullable: true })
  mileage: number; // Kilométrage (véhicules)

  @Column({ nullable: true })
  size: string; // Taille/Dimensions

  @Column({ nullable: true })
  weight: string; // Poids

  @Column({ nullable: true })
  power: string; // Puissance/Consommation

  @Column('json', { nullable: true })
  specifications: string[]; // Spécifications techniques

  @Column('json', { nullable: true })
  features: string[]; // Caractéristiques/Options

  @Column({
    type: 'enum',
    enum: AdPublisherRole,
    default: AdPublisherRole.OWNER
  })
  publisherRole: AdPublisherRole;

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

  @OneToMany(() => Review, review => review.ad)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}