import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('search_alerts')
export class SearchAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'min_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minPrice: number;

  @Column({ name: 'max_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxPrice: number;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  bathrooms: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'last_notified_at', nullable: true })
  lastNotifiedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}