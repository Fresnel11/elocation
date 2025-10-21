import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AdsService } from '../ads/ads.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MonerooService } from '../moneroo/moneroo.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class BookingsService {
    private bookingRepository;
    private adsService;
    private notificationsService;
    private monerooService;
    constructor(bookingRepository: Repository<Booking>, adsService: AdsService, notificationsService: NotificationsService, monerooService: MonerooService);
    create(createBookingDto: CreateBookingDto, user: any): Promise<Booking>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findUserBookings(userId: string, paginationDto: PaginationDto): Promise<{
        data: Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOwnerBookings(userId: string, paginationDto: PaginationDto): Promise<{
        data: Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, user: any): Promise<Booking>;
    getAdAvailability(adId: string, startDate?: string, endDate?: string): Promise<{
        isAvailable: boolean;
        conflictingBookings: Booking[];
        pendingRequests: number;
        message: string;
    }>;
    acceptBooking(bookingId: string, userId: string): Promise<{
        booking: Booking;
        paymentUrl?: string;
    }>;
    rejectBooking(bookingId: string, userId: string, reason?: string): Promise<Booking>;
    processExpiredBookings(): Promise<{
        processed: number;
    }>;
    confirmPayment(bookingId: string, paymentData: any): Promise<Booking>;
    releaseFundsToOwner(bookingId: string): Promise<any>;
}
