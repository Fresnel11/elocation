import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AdsService } from '../ads/ads.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class BookingsService {
    private bookingRepository;
    private adsService;
    constructor(bookingRepository: Repository<Booking>, adsService: AdsService);
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
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, user: any): Promise<Booking>;
    getAdAvailability(adId: string, startDate?: string, endDate?: string): Promise<{
        isAvailable: boolean;
        conflictingBookings: Booking[];
    }>;
}
