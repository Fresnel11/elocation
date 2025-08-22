import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enum';
import { Ad } from '../../ads/entities/ad.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  @Index({ unique: true })
  email: string | null;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @Index({ unique: true })
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column('varchar', { length: 512, nullable: true })
  profilePicture: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otpCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Ad, (ad) => ad.user)
  ads: Ad[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}