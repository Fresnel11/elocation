import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/services/email.service';
import { ReferralsService } from '../referrals/referrals.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private referralsService: ReferralsService,
  ) {}

  async register(registerDto: RegisterDto) {
    if (!registerDto.email && !registerDto.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    if (registerDto.email) {
      const existingUser = await this.usersService.findByEmail(registerDto.email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
    }

    const user = await this.usersService.create(registerDto);

    // Traiter le code de parrainage si fourni
    if (registerDto.referralCode) {
      try {
        await this.referralsService.useReferralCode(registerDto.referralCode, user.id);
      } catch (error) {
        console.log('Erreur code parrainage:', error.message);
      }
    }

    // generate OTP (6 digits) for phone verification
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    if (user.phone) {
      await this.usersService.setOtpForPhone(user.phone, code, expiresAt);
    }

    // Send OTP by email if email is provided
    if (user.email) {
      await this.emailService.sendOtpEmail(user.email, code, user.firstName);
    }

    return {
      message: 'Registration successful. Verify your phone with the OTP code.',
      phone: user.phone,
      expiresAt,
    };
  }

  async requestOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.usersService.setOtpForEmail(email, code, expiresAt);
    await this.emailService.sendOtpEmail(email, code, user.firstName);
    return { message: 'OTP sent to email', email, expiresAt };
  }

  async verifyOtp(email: string, code: string) {
    const ok = await this.usersService.verifyOtpForEmail(email, code);
    if (!ok) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'Email verified. Account activated.' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account not activated. Please verify your email with the OTP code to activate your account.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.setLastLogin(user.id);

    const payload = { sub: user.id, role: user.role, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profile?.avatar || user.profilePicture,
      },
    };
  }

  async validateGoogleUser(googleUser: any) {
    let user = await this.usersService.findByEmail(googleUser.email);
    
    if (!user) {
      // Créer un nouvel utilisateur avec Google
      user = await this.usersService.createGoogleUser({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        profilePicture: googleUser.profilePicture,
        googleId: googleUser.googleId,
      });
    }

    await this.usersService.setLastLogin(user.id);

    const payload = { sub: user.id, role: user.role, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profile?.avatar || user.profilePicture,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    
    return { 
      message: 'User found', 
      email,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      }
    };
  }

  async sendPasswordResetCode(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    
    // Vérifier si un code valide existe déjà
    if (user.resetPasswordOtp && user.resetPasswordOtpExpiresAt && user.resetPasswordOtpExpiresAt > new Date()) {
      return { 
        message: 'Password reset code already sent', 
        email, 
        expiresAt: user.resetPasswordOtpExpiresAt
      };
    }
    
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await this.usersService.setOtpForPasswordReset(email, code, expiresAt);
    await this.emailService.sendPasswordResetEmail(email, code, user.firstName);
    
    return { 
      message: 'Password reset code sent to email', 
      email, 
      expiresAt
    };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const isValidOtp = await this.usersService.verifyOtpForPasswordReset(email, code);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    
    await this.usersService.resetPassword(email, newPassword);
    return { message: 'Password reset successfully' };
  }

  async getUserWithProfile(userId: string) {
    return this.usersService.findOne(userId);
  }
}