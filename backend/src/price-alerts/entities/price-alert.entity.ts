import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';

@Entity('price_alerts')
export class PriceAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Ad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adId' })
  ad: Ad;

  @Column('decimal', { precision: 10, scale: 2 })
  previousPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  newPrice: number;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}