import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';

export enum InteractionType {
  VIEW = 'view',
  FAVORITE = 'favorite',
  SHARE = 'share',
  CONTACT = 'contact',
  BOOKING = 'booking'
}

@Entity('user_interactions')
export class UserInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'ad_id' })
  adId: string;

  @ManyToOne(() => Ad)
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}