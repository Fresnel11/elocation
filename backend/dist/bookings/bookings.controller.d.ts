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
    findReceivedBookings(req: any, paginationDto: PaginationDto): Promise<{
        data: import("./entities/booking.entity").Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    checkAvailability(adId: string, startDate?: string, endDate?: string): Promise<{
        isAvailable: boolean;
        conflictingBookings: import("./entities/booking.entity").Booking[];
        pendingRequests: number;
        message: string;
    }>;
    findOne(id: string): Promise<import("./entities/booking.entity").Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, req: any): Promise<import("./entities/booking.entity").Booking>;
    acceptBooking(id: string, req: any): Promise<{
        booking: import("./entities/booking.entity").Booking;
        paymentUrl?: string;
    }>;
    rejectBooking(id: string, reason: string, req: any): Promise<import("./entities/booking.entity").Booking>;
    releaseFunds(id: string): Promise<any>;
    processExpiredBookings(): Promise<{
        processed: number;
    }>;
}
