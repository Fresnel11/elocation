import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  NEW_AD_MATCH = 'new_ad_match',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_STATUS_CHANGE = 'booking_status_change',
  PRICE_CHANGE = 'price_change',
  MESSAGE_RECEIVED = 'message_received',
  REVIEW_RECEIVED = 'review_received'
}

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ default: true, name: 'email_enabled' })
  emailEnabled: boolean;

  @Column({ default: true, name: 'push_enabled' })
  pushEnabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}