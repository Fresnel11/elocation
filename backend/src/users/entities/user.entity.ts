import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Ad } from '../../ads/entities/ad.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Role } from '../../roles/entities/role.entity';
import { Request } from '../../requests/entities/request.entity';
import { Response } from '../../responses/entities/response.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { UserProfile } from './user-profile.entity';
import { UserVerification } from './user-verification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  email: string | null;

  @Column('varchar', { length: 100 })
  firstName: string;

  @Column('varchar', { length: 100 })
  lastName: string;

  @Column('varchar', { length: 20, unique: true, nullable: true })
  phone: string | null;

  @Column('varchar', { length: 20, nullable: true })
  whatsappNumber: string | null;

  @Column('varchar', { length: 255, nullable: true })
  @Exclude()
  password: string | null;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  googleId: string | null;

  @Column('varchar', { length: 512, nullable: true })
  profilePicture: string | null;

  @Column({ type: 'text', nullable: true })
  publicKey: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'enum', enum: ['masculin', 'féminin'], nullable: true })
  gender: 'masculin' | 'féminin' | null;

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

  @Column({ type: 'varchar', length: 10, nullable: true, unique: true })
  referralCode: string | null;

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

  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];

  @OneToMany(() => Response, (response) => response.user)
  responses: Response[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToOne(() => UserProfile, profile => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToOne(() => UserVerification, verification => verification.user, { cascade: true })
  verification: UserVerification;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ name: 'loyalty_points', default: 0 })
  loyaltyPoints: number;

  @Column({ name: 'accepted_terms', default: false })
  acceptedTerms: boolean;

  @Column({ name: 'terms_accepted_at', type: 'timestamp', nullable: true })
  termsAcceptedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}