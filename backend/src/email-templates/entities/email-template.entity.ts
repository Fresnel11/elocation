import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EmailTemplateType {
  WELCOME = 'welcome',
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_CANCELLED = 'booking_cancelled',
  AD_APPROVED = 'ad_approved',
  AD_REJECTED = 'ad_rejected',
  REVIEW_NOTIFICATION = 'review_notification',
  PASSWORD_RESET = 'password_reset'
}

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EmailTemplateType, unique: true })
  type: EmailTemplateType;

  @Column()
  subject: string;

  @Column('text')
  htmlContent: string;

  @Column('text', { nullable: true })
  textContent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  variables: string[]; // Variables disponibles comme {{userName}}, {{adTitle}}

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}