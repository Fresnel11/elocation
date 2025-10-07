import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral, ReferralStatus } from './entities/referral.entity';
import { LoyaltyPoints, PointType } from './entities/loyalty-points.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(LoyaltyPoints)
    private loyaltyPointsRepository: Repository<LoyaltyPoints>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    // Générer un code unique basé sur le nom et un nombre aléatoire
    const code = `${user.firstName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Vérifier l'unicité
    const existing = await this.referralRepository.findOne({ where: { referralCode: code } });
    if (existing) return this.generateReferralCode(userId);
    
    return code;
  }

  async useReferralCode(referralCode: string, newUserId: string): Promise<Referral> {
    // Vérifier que le code existe
    const referrer = await this.userRepository.findOne({ where: { referralCode } });
    if (!referrer) throw new BadRequestException('Code de parrainage invalide');

    // Vérifier que l'utilisateur n'utilise pas son propre code
    if (referrer.id === newUserId) throw new BadRequestException('Vous ne pouvez pas utiliser votre propre code');

    // Vérifier que l'utilisateur n'a pas déjà été parrainé
    const existing = await this.referralRepository.findOne({ where: { referredId: newUserId } });
    if (existing) throw new BadRequestException('Vous avez déjà utilisé un code de parrainage');

    // Créer le parrainage
    const referral = this.referralRepository.create({
      referrerId: referrer.id,
      referredId: newUserId,
      referralCode,
      status: ReferralStatus.PENDING,
    });

    return this.referralRepository.save(referral);
  }

  async completeReferral(referredUserId: string): Promise<void> {
    const referral = await this.referralRepository.findOne({
      where: { referredId: referredUserId, status: ReferralStatus.PENDING },
      relations: ['referrer', 'referred']
    });

    if (!referral) return;

    // Marquer comme complété
    referral.status = ReferralStatus.COMPLETED;
    referral.rewardAmount = 5000; // 5000 FCFA de récompense
    await this.referralRepository.save(referral);

    // Ajouter des points de fidélité
    await this.addLoyaltyPoints(referral.referrerId, PointType.REFERRAL, 100, 'Parrainage réussi', referral.id);
    await this.addLoyaltyPoints(referredUserId, PointType.REFERRAL, 50, 'Inscription via parrainage', referral.id);
  }

  async addLoyaltyPoints(userId: string, type: PointType, points: number, description?: string, referenceId?: string): Promise<void> {
    const loyaltyPoints = this.loyaltyPointsRepository.create({
      userId,
      type,
      points,
      description,
      referenceId,
    });

    await this.loyaltyPointsRepository.save(loyaltyPoints);
  }

  async getUserLoyaltyPoints(userId: string): Promise<{ total: number; history: LoyaltyPoints[] }> {
    const history = await this.loyaltyPointsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const total = history.reduce((sum, point) => sum + point.points, 0);
    return { total, history };
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { referrerId: userId },
      relations: ['referred'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReferralStats(userId: string): Promise<{ totalReferrals: number; completedReferrals: number; totalRewards: number }> {
    const referrals = await this.referralRepository.find({ where: { referrerId: userId } });
    
    return {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter(r => r.status === ReferralStatus.COMPLETED).length,
      totalRewards: referrals.reduce((sum, r) => sum + Number(r.rewardAmount), 0),
    };
  }
}