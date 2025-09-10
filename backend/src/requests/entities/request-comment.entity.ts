import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Request } from './request.entity';

@Entity('request_comments')
export class RequestComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.requestComments)
  user: User;

  @ManyToOne(() => Request, request => request.comments)
  request: Request;

  @CreateDateColumn()
  createdAt: Date;
}