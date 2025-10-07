import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PointType {
  REFERRAL = 'referral',
  BOOKING = 'booking',
  REVIEW = 'review',
  BONUS = 'bonus'
}

@Entity('loyalty_points')
export class LoyaltyPoints {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: PointType })
  type: PointType;

  @Column()
  points: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}