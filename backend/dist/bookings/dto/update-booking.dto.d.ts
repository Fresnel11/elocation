import { BookingStatus } from '../entities/booking.entity';
export declare class UpdateBookingDto {
    status?: BookingStatus;
    cancellationReason?: string;
}
