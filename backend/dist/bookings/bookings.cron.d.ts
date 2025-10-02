import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
export declare class BookingsCronService {
    private bookingRepository;
    constructor(bookingRepository: Repository<Booking>);
    expireOldPendingBookings(): Promise<void>;
}
