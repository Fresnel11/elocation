import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user1: User;

  @Column()
  user1Id: string;

  @ManyToOne(() => User)
  user2: User;

  @Column()
  user2Id: string;

  @ManyToOne(() => Ad, { nullable: true })
  ad: Ad | null;

  @Column({ nullable: true })
  adId: string | null;

  @Column({ nullable: true })
  lastMessageContent: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @Column({ default: 0 })
  unreadCountUser1: number;

  @Column({ default: 0 })
  unreadCountUser2: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}