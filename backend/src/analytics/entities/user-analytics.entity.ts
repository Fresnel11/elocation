import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_analytics')
export class UserAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'total_ads', default: 0 })
  totalAds: number;

  @Column({ name: 'active_ads', default: 0 })
  activeAds: number;

  @Column({ name: 'total_views', default: 0 })
  totalViews: number;

  @Column({ name: 'total_bookings', default: 0 })
  totalBookings: number;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ name: 'occupancy_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  occupancyRate: number;

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}