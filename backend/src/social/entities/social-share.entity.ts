import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';

export enum SharePlatform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  LINK = 'link'
}

@Entity('social_shares')
export class SocialShare {
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

  @Column({ type: 'enum', enum: SharePlatform })
  platform: SharePlatform;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}