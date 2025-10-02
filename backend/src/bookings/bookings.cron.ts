import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingsCronService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async expireOldPendingBookings() {
    console.log('🔄 Vérification des demandes de réservation expirées...');
    
    // Expirer les demandes en attente depuis plus de 48h
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    const expiredBookings = await this.bookingRepository.update(
      {
        status: BookingStatus.PENDING,
        createdAt: LessThan(twoDaysAgo),
      },
      {
        status: BookingStatus.EXPIRED,
        cancellationReason: 'Demande expirée - Aucune réponse du propriétaire dans les 48h',
      }
    );

    if (expiredBookings.affected && expiredBookings.affected > 0) {
      console.log(`✅ ${expiredBookings.affected} demande(s) de réservation expirée(s)`);
    }
  }
}