import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';

export enum ReportType {
  AD = 'ad',
  USER = 'user'
}

export enum ReportReason {
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SPAM = 'spam',
  FRAUD = 'fraud',
  HARASSMENT = 'harassment',
  FAKE_LISTING = 'fake_listing',
  OFFENSIVE_BEHAVIOR = 'offensive_behavior',
  OTHER = 'other'
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed'
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'enum', enum: ReportReason })
  reason: ReportReason;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ name: 'reporter_id' })
  reporterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ name: 'reported_ad_id', nullable: true })
  reportedAdId: string;

  @ManyToOne(() => Ad, { nullable: true })
  @JoinColumn({ name: 'reported_ad_id' })
  reportedAd: Ad;

  @Column({ name: 'reported_user_id', nullable: true })
  reportedUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reported_user_id' })
  reportedUser: User;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}