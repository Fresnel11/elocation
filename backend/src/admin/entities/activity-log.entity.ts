import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // CREATE, UPDATE, DELETE, LOGIN, etc.

  @Column()
  entity: string; // User, Ad, Booking, etc.

  @Column({ nullable: true })
  entityId: string;

  @Column('json', { nullable: true })
  oldData: any;

  @Column('json', { nullable: true })
  newData: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}