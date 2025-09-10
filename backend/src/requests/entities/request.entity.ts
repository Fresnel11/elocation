import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { RequestComment } from './request-comment.entity';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxBudget: number;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  bathrooms: number;

  @Column({ nullable: true })
  minArea: number;

  @Column('json', { nullable: true })
  desiredAmenities: string[];

  // Champs génériques pour différentes catégories
  @Column({ nullable: true })
  desiredBrand: string; // Marque souhaitée

  @Column({ nullable: true })
  desiredModel: string; // Modèle souhaité

  @Column({ type: 'int', nullable: true })
  minYear: number; // Année minimum

  @Column({ nullable: true })
  desiredCondition: string; // État souhaité

  @Column({ nullable: true })
  desiredColor: string; // Couleur souhaitée

  @Column({ nullable: true })
  desiredFuel: string; // Carburant souhaité

  @Column({ nullable: true })
  desiredTransmission: string; // Transmission souhaitée

  @Column({ type: 'int', nullable: true })
  maxMileage: number; // Kilométrage maximum

  @Column({ nullable: true })
  desiredSize: string; // Taille souhaitée

  @Column('json', { nullable: true })
  desiredFeatures: string[]; // Caractéristiques souhaitées

  @Column({ default: 'active' })
  status: string; // active, fulfilled, closed

  @ManyToOne(() => User, user => user.requests)
  user: User;

  @ManyToOne(() => Category, category => category.requests)
  category: Category;

  @OneToMany(() => RequestComment, comment => comment.request)
  comments: RequestComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}