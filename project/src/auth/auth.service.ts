import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    // generate OTP (6 digits) for phone verification
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await this.usersService.setOtpForPhone(user.phone, code, expiresAt);

    // TODO: integrate SMS provider here; for now, return code in response for testing only

    return {
      message: 'Registration successful. Verify your phone with the OTP code.',
      phone: user.phone,
      otpPreview: code,
      expiresAt,
    };
  }

  async requestOtp(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new BadRequestException('User not found');
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.usersService.setOtpForPhone(phone, code, expiresAt);
    return { message: 'OTP sent', phone, otpPreview: code, expiresAt };
  }

  async verifyOtp(phone: string, code: string) {
    const ok = await this.usersService.verifyOtpForPhone(phone, code);
    if (!ok) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'Phone verified. You can now log in.' };
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.email && !loginDto.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    const user = loginDto.email
      ? await this.usersService.findByEmail(loginDto.email)
      : await this.usersService.findByPhone(loginDto.phone as string);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.setLastLogin(user.id);

    const payload = { sub: user.id, role: user.role, email: user.email ?? undefined };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}