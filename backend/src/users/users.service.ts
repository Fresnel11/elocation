import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
      relations: ['ads', 'payments'],
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

  async getPublicProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'createdAt'],
      relations: ['ads'],
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
      _count: {
        ads: user.ads?.length || 0
      }
    };
  }
}