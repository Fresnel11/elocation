import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
import { Payment } from '../payments/entities/payment.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { StatsDto } from './dto/stats.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDashboardStats(): Promise<StatsDto> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalAds,
      totalPayments,
      activeAds,
      pendingPayments,
      recentUsers,
      recentAds,
      completedPayments,
    ] = await Promise.all([
      this.userRepository.count(),
      this.adRepository.count(),
      this.paymentRepository.count(),
      this.adRepository.count({ where: { isActive: true } }),
      this.paymentRepository.count({ where: { status: PaymentStatus.PENDING } }),
      this.userRepository.count({ where: { createdAt: thirtyDaysAgo } }),
      this.adRepository.count({ where: { createdAt: thirtyDaysAgo } }),
      this.paymentRepository.find({
        where: { status: PaymentStatus.COMPLETED },
        select: ['amount'],
      }),
    ]);

    const totalRevenue = completedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);

    return {
      totalUsers,
      totalAds,
      totalPayments,
      totalRevenue,
      activeAds,
      pendingPayments,
      recentUsers,
      recentAds,
    };
  }

  async moderateAd(adId: string, action: 'approve' | 'reject'): Promise<Ad> {
    const ad = await this.adRepository.findOne({ where: { id: adId } });
    if (!ad) {
      throw new Error('Ad not found');
    }

    ad.isActive = action === 'approve';
    return this.adRepository.save(ad);
  }

  async getPendingAds() {
    return this.adRepository.find({
      where: { isActive: false },
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRecentUsers(limit: number = 10) {
    return this.userRepository.find({
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getRecentPayments(limit: number = 10) {
    return this.paymentRepository.find({
      relations: ['user'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}