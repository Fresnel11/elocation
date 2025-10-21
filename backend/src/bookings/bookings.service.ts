import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AdsService } from '../ads/ads.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MonerooService } from '../moneroo/moneroo.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private adsService: AdsService,
    private notificationsService: NotificationsService,
    private monerooService: MonerooService,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: any): Promise<Booking> {
    const { adId, startDate, endDate, message, deposit } = createBookingDto;

    // Vérifier que l'annonce existe
    const ad = await this.adsService.findOne(adId);
    if (!ad) {
      throw new NotFoundException('Annonce non trouvée');
    }

    // Vérifier que l'utilisateur ne réserve pas sa propre annonce
    if (ad.user.id === user.id) {
      throw new BadRequestException('Vous ne pouvez pas réserver votre propre annonce');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérifier que les dates sont valides
    if (start >= end) {
      throw new BadRequestException('La date de fin doit être après la date de début');
    }

    if (start < new Date()) {
      throw new BadRequestException('La date de début ne peut pas être dans le passé');
    }

    // Vérifier la disponibilité (inclure PENDING et ACCEPTED pour bloquer temporairement)
    const conflictingBookings = await this.bookingRepository.find({
      where: {
        ad: { id: adId },
        status: In([BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.CONFIRMED]),
        startDate: Between(start, end),
      },
    });

    if (conflictingBookings.length > 0) {
      const pendingBookings = conflictingBookings.filter(b => b.status === BookingStatus.PENDING);
      if (pendingBookings.length > 0) {
        throw new BadRequestException('Ces dates sont déjà en cours de demande par un autre utilisateur.');
      }
      throw new BadRequestException('Ces dates ne sont pas disponibles');
    }

    // Calculer le prix total selon la modalité de paiement
    let totalPrice: number;
    const timeDiff = end.getTime() - start.getTime();
    
    switch (ad.paymentMode) {
      case 'hourly':
        const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
        totalPrice = hours * parseFloat(String(ad.price));
        break;
      case 'daily':
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        totalPrice = days * parseFloat(String(ad.price));
        break;
      case 'weekly':
        const weeks = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
        totalPrice = weeks * parseFloat(String(ad.price));
        break;
      case 'monthly':
        const months = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 30));
        totalPrice = months * parseFloat(String(ad.price));
        break;
      case 'fixed':
      default:
        totalPrice = parseFloat(String(ad.price));
        break;
    }

    const booking = this.bookingRepository.create({
      ad,
      tenant: user,
      owner: ad.user,
      startDate: start,
      endDate: end,
      totalPrice,
      deposit: deposit || totalPrice * 0.2, // 20% par défaut
      message,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Envoyer notification au propriétaire
    await this.notificationsService.notifyBookingRequest(ad.user.id, {
      bookingId: savedBooking.id,
      adId: ad.id,
      adTitle: ad.title,
      tenantName: `${user.firstName} ${user.lastName}`,
    });

    return savedBooking;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const [bookings, total] = await this.bookingRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUserBookings(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { tenant: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOwnerBookings(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { owner: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, user: any): Promise<Booking> {
    const booking = await this.findOne(id);

    // Vérifier les permissions
    if (booking.owner.id !== user.id && booking.tenant.id !== user.id) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette réservation');
    }

    // Seul le propriétaire peut confirmer
    if (updateBookingDto.status === BookingStatus.CONFIRMED && booking.owner.id !== user.id) {
      throw new ForbiddenException('Seul le propriétaire peut confirmer une réservation');
    }

    Object.assign(booking, updateBookingDto);
    const updatedBooking = await this.bookingRepository.save(booking);

    // Envoyer notifications selon le changement de statut
    if (updateBookingDto.status === BookingStatus.CONFIRMED) {
      await this.notificationsService.notifyBookingConfirmed(booking.tenant.id, {
        bookingId: booking.id,
        adId: booking.ad.id,
        adTitle: booking.ad.title,
      });
    } else if (updateBookingDto.status === BookingStatus.CANCELLED) {
      const targetUserId = user.id === booking.owner.id ? booking.tenant.id : booking.owner.id;
      await this.notificationsService.notifyBookingCancelled(targetUserId, {
        bookingId: booking.id,
        adId: booking.ad.id,
        adTitle: booking.ad.title,
      }, updateBookingDto.cancellationReason);
    }

    return updatedBooking;
  }

  async getAdAvailability(adId: string, startDate?: string, endDate?: string) {
    const query = this.bookingRepository.createQueryBuilder('booking')
      .where('booking.adId = :adId', { adId })
      .andWhere('booking.status IN (:...statuses)', { 
        statuses: [BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.CONFIRMED] 
      });

    if (startDate && endDate) {
      query.andWhere(
        '(booking.startDate BETWEEN :startDate AND :endDate OR booking.endDate BETWEEN :startDate AND :endDate)',
        { startDate, endDate }
      );
    }

    const bookings = await query.getMany();
    const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
    
    return {
      isAvailable: bookings.length === 0,
      conflictingBookings: bookings,
      pendingRequests: pendingBookings.length,
      message: pendingBookings.length > 0 ? 
        `${pendingBookings.length} demande(s) en attente sur ces dates` : null
    };
  }

  async acceptBooking(bookingId: string, userId: string): Promise<{ booking: Booking; paymentUrl?: string }> {
    const booking = await this.findOne(bookingId);
    
    if (booking.owner.id !== userId) {
      throw new ForbiddenException('Seul le propriétaire peut accepter une réservation');
    }
    
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Cette réservation ne peut plus être acceptée');
    }
    
    booking.status = BookingStatus.ACCEPTED;
    const updatedBooking = await this.bookingRepository.save(booking);
    
    // Créer le paiement Moneroo
    try {
      const paymentData = await this.monerooService.initializePayment(
        booking.deposit,
        'XOF',
        {
          bookingId: booking.id,
          adId: booking.ad.id,
          tenantId: booking.tenant.id,
          ownerId: booking.owner.id,
        }
      );
      
      // Notifier le locataire avec le lien de paiement
      await this.notificationsService.notifyBookingConfirmed(booking.tenant.id, {
        bookingId: booking.id,
        adId: booking.ad.id,
        adTitle: booking.ad.title,
        paymentUrl: paymentData.payment_url,
      });
      
      return { booking: updatedBooking, paymentUrl: paymentData.payment_url };
    } catch (error) {
      console.error('Erreur lors de la création du paiement Moneroo:', error);
      
      // Notifier sans lien de paiement en cas d'erreur
      await this.notificationsService.notifyBookingConfirmed(booking.tenant.id, {
        bookingId: booking.id,
        adId: booking.ad.id,
        adTitle: booking.ad.title,
      });
      
      return { booking: updatedBooking };
    }
  }

  async rejectBooking(bookingId: string, userId: string, reason?: string): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    
    if (booking.owner.id !== userId) {
      throw new ForbiddenException('Seul le propriétaire peut refuser une réservation');
    }
    
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Cette réservation ne peut plus être refusée');
    }
    
    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = reason || 'Refusée par le propriétaire';
    const updatedBooking = await this.bookingRepository.save(booking);
    
    // Notifier le locataire que sa demande a été refusée
    await this.notificationsService.notifyBookingCancelled(booking.tenant.id, {
      bookingId: booking.id,
      adId: booking.ad.id,
      adTitle: booking.ad.title,
    }, reason);
    
    return updatedBooking;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async processExpiredBookings(): Promise<{ processed: number }> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const expiredBookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.PENDING,
        createdAt: LessThan(twentyFourHoursAgo)
      }
    });
    
    for (const booking of expiredBookings) {
      booking.status = BookingStatus.EXPIRED;
      booking.cancellationReason = 'Expirée - Pas de réponse du propriétaire dans les 24h';
      await this.bookingRepository.save(booking);
      
      // Notifier le locataire que sa demande a expiré
      await this.notificationsService.notifyBookingCancelled(booking.tenant.id, {
        bookingId: booking.id,
        adId: booking.ad.id,
        adTitle: booking.ad.title,
      }, 'Expirée - Pas de réponse du propriétaire dans les 24h');
    }
    
    console.log(`[BookingsService] ${expiredBookings.length} réservations expirées traitées`);
    return { processed: expiredBookings.length };
  }

  async confirmPayment(bookingId: string, paymentData: any): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    
    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new BadRequestException('Cette réservation n\'est pas en attente de paiement');
    }
    
    booking.status = BookingStatus.CONFIRMED;
    booking.paymentId = paymentData.payment_id;
    booking.paidAt = new Date();
    
    const updatedBooking = await this.bookingRepository.save(booking);
    
    // Notifier le propriétaire que le paiement a été effectué
    await this.notificationsService.notifyBookingConfirmed(booking.owner.id, {
      bookingId: booking.id,
      adId: booking.ad.id,
      adTitle: booking.ad.title,
      message: 'Le paiement a été effectué, la réservation est confirmée',
    });
    
    return updatedBooking;
  }

  async releaseFundsToOwner(bookingId: string): Promise<any> {
    const booking = await this.findOne(bookingId);
    
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cette réservation n\'est pas confirmée');
    }
    
    if (booking.fundsReleased) {
      throw new BadRequestException('Les fonds ont déjà été libérés');
    }
    
    // Vérifier que la date de début est passée (ou proche)
    const now = new Date();
    const startDate = new Date(booking.startDate);
    
    if (startDate > now) {
      throw new BadRequestException('Les fonds ne peuvent être libérés qu\'après le début de la réservation');
    }
    
    try {
      // Calculer le montant à verser (dépôt - frais de service)
      const serviceFeesRate = 0.05; // 5% de frais de service
      const amountToRelease = booking.deposit * (1 - serviceFeesRate);
      
      const payoutData = await this.monerooService.initializePayout(amountToRelease, {
        phone: booking.owner.phone,
        email: booking.owner.email,
        name: `${booking.owner.firstName} ${booking.owner.lastName}`,
      });
      
      // Marquer les fonds comme libérés
      booking.fundsReleased = true;
      booking.fundsReleasedAt = new Date();
      booking.payoutId = payoutData.payout_id;
      
      await this.bookingRepository.save(booking);
      
      return payoutData;
    } catch (error) {
      console.error('Erreur lors de la libération des fonds:', error);
      throw new BadRequestException('Erreur lors de la libération des fonds');
    }
  }
}