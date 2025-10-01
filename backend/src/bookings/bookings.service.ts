import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AdsService } from '../ads/ads.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private adsService: AdsService,
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

    // Vérifier la disponibilité
    const conflictingBookings = await this.bookingRepository.find({
      where: {
        ad: { id: adId },
        status: BookingStatus.CONFIRMED,
        startDate: Between(start, end),
      },
    });

    if (conflictingBookings.length > 0) {
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

    return this.bookingRepository.save(booking);
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
      where: [
        { tenant: { id: userId } },
        { owner: { id: userId } },
      ],
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
    return this.bookingRepository.save(booking);
  }

  async getAdAvailability(adId: string, startDate?: string, endDate?: string) {
    const query = this.bookingRepository.createQueryBuilder('booking')
      .where('booking.adId = :adId', { adId })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED });

    if (startDate && endDate) {
      query.andWhere(
        '(booking.startDate BETWEEN :startDate AND :endDate OR booking.endDate BETWEEN :startDate AND :endDate)',
        { startDate, endDate }
      );
    }

    const bookings = await query.getMany();
    return {
      isAvailable: bookings.length === 0,
      conflictingBookings: bookings,
    };
  }
}