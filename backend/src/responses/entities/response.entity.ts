import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Request } from '../../requests/entities/request.entity';

@Entity('responses')
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  message: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  proposedPrice: number;

  @Column()
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ type: 'date', nullable: true })
  availableFrom: Date;

  @Column('json', { nullable: true })
  images: string[];

  @ManyToOne(() => User, (user) => user.responses)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Request, (request) => request.responses)
  @JoinColumn({ name: 'requestId' })
  request: Request;

  @Column()
  requestId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}