import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Ad, ad => ad.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adId' })
  ad: Ad;

  @CreateDateColumn()
  createdAt: Date;
}