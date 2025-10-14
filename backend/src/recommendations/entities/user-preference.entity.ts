import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_preferences')
@Index(['userId', 'type'])
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  type: string; // 'view', 'favorite', 'search', 'contact'

  @Column('json')
  data: {
    categoryId?: string;
    location?: string;
    priceRange?: [number, number];
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    adId?: string;
  };

  @Column({ default: 1 })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;
}