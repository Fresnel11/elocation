import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Ad } from '../../ads/entities/ad.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  @Index({ unique: true })
  email: string | null;

  @Column('varchar', { length: 100 })
  firstName: string;

  @Column('varchar', { length: 100 })
  lastName: string;

  @Column('varchar', { length: 20, unique: true, nullable: true })
  @Index({ unique: true })
  phone: string | null;

  @Column('varchar', { length: 255, nullable: true })
  @Exclude()
  password: string | null;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  @Index({ unique: true })
  googleId: string | null;

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

  @Column({ type: 'varchar', length: 6, nullable: true })
  resetPasswordOtp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordOtpExpiresAt: Date | null;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column('varchar', { length: 36, nullable: true })
  roleId: string;

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