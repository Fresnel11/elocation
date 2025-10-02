import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  BOOKING_REQUEST = 'booking_request',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_EXPIRED = 'booking_expired',
  NEW_MESSAGE = 'new_message',
  AD_APPROVED = 'ad_approved',
  AD_REJECTED = 'ad_rejected'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'json', nullable: true })
  data: any;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}