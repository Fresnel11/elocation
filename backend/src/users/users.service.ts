import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { UserVerification, VerificationStatus } from './entities/user-verification.entity';

import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserVerification)
    private readonly verificationRepository: Repository<UserVerification>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.email) {
      const existingByEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email.toLowerCase() },
      });
      if (existingByEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const existingByPhone = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });
    if (existingByPhone) {
      throw new ConflictException('User with this phone already exists');
    }

    // Attribuer automatiquement le rôle "user" par défaut
    const role = await this.roleRepository.findOne({ where: { name: UserRole.USER } });
    if (!role) {
      throw new NotFoundException('Default user role not found');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      email: createUserDto.email ? createUserDto.email.toLowerCase() : null,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      password: hashedPassword,
      profilePicture: createUserDto.profilePicture ?? null,
      birthDate: createUserDto.birthDate ? new Date(createUserDto.birthDate) : null,
      role: role,
      isActive: false,
    });

    return this.userRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ads', 'payments', 'profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['role', 'profile'],
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email.toLowerCase() !== user.email) {
      const exists = await this.userRepository.findOne({ where: { email: updateUserDto.email.toLowerCase() } });
      if (exists) {
        throw new ConflictException('Email already in use');
      }
    }
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const exists = await this.userRepository.findOne({ where: { phone: updateUserDto.phone } });
      if (exists) {
        throw new ConflictException('Phone already in use');
      }
    }

    let role = user.role;
    if (updateUserDto.role) {
      const foundRole = await this.roleRepository.findOne({ where: { name: updateUserDto.role } });
      if (!foundRole) {
        throw new NotFoundException(`Role ${updateUserDto.role} not found`);
      }
      role = foundRole;
    }

    Object.assign(user, {
      email: updateUserDto.email ? updateUserDto.email.toLowerCase() : user.email,
      firstName: updateUserDto.firstName ?? user.firstName,
      lastName: updateUserDto.lastName ?? user.lastName,
      phone: updateUserDto.phone ?? user.phone,
      profilePicture: updateUserDto.profilePicture ?? user.profilePicture,
      birthDate: updateUserDto.birthDate ? new Date(updateUserDto.birthDate) : user.birthDate,
      role: role,
    });
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async toggleUserStatus(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }

  async setLastLogin(id: string): Promise<void> {
    await this.userRepository.update({ id }, { lastLogin: new Date() });
  }

  async setOtpForPhone(phone: string, code: string, expiresAt: Date): Promise<void> {
    const user = await this.findByPhone(phone);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.update({ id: user.id }, { otpCode: code, otpExpiresAt: expiresAt });
  }

  async verifyOtpForPhone(phone: string, code: string): Promise<boolean> {
    const user = await this.findByPhone(phone);
    if (!user) throw new NotFoundException('User not found');
    if (!user.otpCode || !user.otpExpiresAt) return false;
    const isValid = user.otpCode === code && user.otpExpiresAt > new Date();
    if (isValid) {
      await this.userRepository.update({ id: user.id }, { isActive: true, otpCode: null, otpExpiresAt: null });
    }
    return isValid;
  }

  async setOtpForEmail(email: string, code: string, expiresAt: Date): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.update({ id: user.id }, { otpCode: code, otpExpiresAt: expiresAt });
  }

  async setOtpForPasswordReset(email: string, code: string, expiresAt: Date): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.update({ id: user.id }, { resetPasswordOtp: code, resetPasswordOtpExpiresAt: expiresAt });
  }

  async verifyOtpForEmail(email: string, code: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (!user.otpCode || !user.otpExpiresAt) return false;
    const isValid = user.otpCode === code && user.otpExpiresAt > new Date();
    if (isValid) {
      await this.userRepository.update({ id: user.id }, { isActive: true, otpCode: null, otpExpiresAt: null });
    }
    return isValid;
  }

  async createGoogleUser(googleData: any): Promise<User> {
    const role = await this.roleRepository.findOne({ where: { name: UserRole.USER } });
    if (!role) {
      throw new NotFoundException('Default user role not found');
    }

    const user = this.userRepository.create({
      email: googleData.email.toLowerCase(),
      firstName: googleData.firstName,
      lastName: googleData.lastName,
      profilePicture: googleData.profilePicture,
      phone: null,
      password: null, // Pas de mot de passe pour Google
      role: role,
      isActive: true, // Activé automatiquement avec Google
      googleId: googleData.googleId,
    });

    return this.userRepository.save(user);
  }

  async verifyOtpForPasswordReset(email: string, code: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) return false;
    return user.resetPasswordOtp === code && user.resetPasswordOtpExpiresAt > new Date();
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update({ id: user.id }, { 
      password: hashedPassword, 
      resetPasswordOtp: null, 
      resetPasswordOtpExpiresAt: null 
    });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserProfile> {
    console.log('=== SERVICE UPDATE PROFILE ===');
    console.log('UserId:', userId);
    console.log('UpdateProfileDto:', updateProfileDto);
    
    const user = await this.findOne(userId);
    console.log('User found:', user.id, user.email);
    
    // Mettre à jour les champs de l'utilisateur principal
    const userUpdateData: any = {};
    if (updateProfileDto.firstName) userUpdateData.firstName = updateProfileDto.firstName;
    if (updateProfileDto.lastName) userUpdateData.lastName = updateProfileDto.lastName;
    if (updateProfileDto.email) userUpdateData.email = updateProfileDto.email.toLowerCase();
    if (updateProfileDto.phone) userUpdateData.phone = updateProfileDto.phone;
    if (updateProfileDto.whatsappNumber) userUpdateData.whatsappNumber = updateProfileDto.whatsappNumber;
    
    console.log('User update data:', userUpdateData);
    
    if (Object.keys(userUpdateData).length > 0) {
      await this.userRepository.update(userId, userUpdateData);
      console.log('User updated successfully');
    }
    
    let profile = user.profile;
    if (!profile) {
      profile = this.profileRepository.create({ userId });
      console.log('Created new profile for user');
    }
    
    // Mettre à jour les champs du profil
    const { firstName, lastName, email, phone, whatsappNumber, ...profileData } = updateProfileDto;
    console.log('Profile data to update:', profileData);
    Object.assign(profile, profileData);
    const savedProfile = await this.profileRepository.save(profile);
    console.log('Profile saved successfully:', savedProfile.id);
    console.log('===============================');
    return savedProfile;
  }

  async uploadAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    return this.updateProfile(userId, { avatar: avatarUrl });
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.findOne(userId);
    return user.profile || this.profileRepository.create({ userId });
  }

  async addBadge(userId: string, badge: string): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile.badges) {
      profile.badges = [];
    }
    if (!profile.badges.includes(badge)) {
      profile.badges.push(badge);
      return this.profileRepository.save(profile);
    }
    return profile;
  }

  async getPublicProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'createdAt'],
      relations: ['ads', 'profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      profile: user.profile,
      _count: {
        ads: user.ads?.length || 0
      }
    };
  }

  async submitVerification(userId: string, submitVerificationDto: SubmitVerificationDto): Promise<UserVerification> {
    const user = await this.findOne(userId);
    
    const existingVerification = await this.verificationRepository.findOne({
      where: { userId }
    });
    
    if (existingVerification && existingVerification.status === VerificationStatus.PENDING) {
      throw new ConflictException('Verification request already pending');
    }
    
    if (existingVerification && existingVerification.status === VerificationStatus.APPROVED) {
      throw new ConflictException('User already verified');
    }

    const verification = this.verificationRepository.create({
      userId,
      ...submitVerificationDto,
      status: VerificationStatus.PENDING
    });

    const savedVerification = await this.verificationRepository.save(verification);
    
    // TODO: Notifier les admins via WebSocket
    
    // Créer une notification pour les admins (à implémenter pour les admins)
    // TODO: Créer notification pour tous les admins
    
    return savedVerification;
  }

  async reviewVerification(verificationId: string, reviewDto: ReviewVerificationDto, adminId: string): Promise<UserVerification> {
    const verification = await this.verificationRepository.findOne({
      where: { id: verificationId },
      relations: ['user']
    });

    if (!verification) {
      throw new NotFoundException('Verification request not found');
    }

    verification.status = reviewDto.status;
    verification.rejectionReason = reviewDto.rejectionReason;
    verification.reviewedBy = adminId;
    verification.reviewedAt = new Date();

    if (reviewDto.status === VerificationStatus.APPROVED) {
      await this.userRepository.update(verification.userId, { isVerified: true });
    }

    const updatedVerification = await this.verificationRepository.save(verification);
    
    // TODO: Notifier l'utilisateur du résultat
    
    // Créer une notification pour l'utilisateur
    const statusMessage = reviewDto.status === VerificationStatus.APPROVED 
      ? 'Votre identité a été vérifiée avec succès !'
      : `Votre demande de vérification a été rejetée : ${reviewDto.rejectionReason}`;
      
    await this.notificationsService.createNotification(
      verification.userId,
      reviewDto.status === VerificationStatus.APPROVED ? NotificationType.VERIFICATION_APPROVED : NotificationType.VERIFICATION_REJECTED,
      reviewDto.status === VerificationStatus.APPROVED ? 'Vérification approuvée' : 'Vérification rejetée',
      statusMessage
    );
    
    return updatedVerification;
  }

  async getPendingVerifications(): Promise<UserVerification[]> {
    return this.verificationRepository.find({
      where: { status: VerificationStatus.PENDING },
      relations: ['user'],
      order: { createdAt: 'ASC' }
    });
  }

  async getUserVerification(userId: string): Promise<UserVerification | null> {
    return this.verificationRepository.findOne({
      where: { userId }
    });
  }

  async updatePublicKey(userId: string, publicKey: string) {
    await this.userRepository.update(userId, { publicKey });
    return { message: 'Clé publique mise à jour avec succès' };
  }

  async getPublicKey(userId: string) {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'publicKey']
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return { publicKey: user.publicKey };
  }

  async exportUserData(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ads', 'profile']
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const exportData = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        whatsappNumber: user.whatsappNumber,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      },
      profile: user.profile,
      ads: user.ads?.map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        price: ad.price,
        location: ad.location,
        createdAt: ad.createdAt
      })) || [],
      exportedAt: new Date().toISOString()
    };

    return exportData;
  }
}