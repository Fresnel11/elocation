import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<import("./entities/booking.entity").Booking>;
    findMyBookings(req: any, paginationDto: PaginationDto): Promise<{
        data: import("./entities/booking.entity").Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    checkAvailability(adId: string, startDate?: string, endDate?: string): Promise<{
        isAvailable: boolean;
        conflictingBookings: import("./entities/booking.entity").Booking[];
    }>;
    findOne(id: string): Promise<import("./entities/booking.entity").Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, req: any): Promise<import("./entities/booking.entity").Booking>;
}
