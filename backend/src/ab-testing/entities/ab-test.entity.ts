import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ab_tests')
export class ABTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('json')
  algorithms: {
    A: { name: string; config: any };
    B: { name: string; config: any };
  };

  @Column({ default: 50 })
  trafficSplit: number; // Pourcentage pour algorithme A

  @Column({ default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  metrics: {
    A: { views: number; clicks: number; conversions: number };
    B: { views: number; clicks: number; conversions: number };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}