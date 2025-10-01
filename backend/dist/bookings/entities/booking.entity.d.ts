import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare class Booking {
    id: string;
    ad: Ad;
    tenant: User;
    owner: User;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    deposit: number;
    status: BookingStatus;
    message: string;
    cancellationReason: string;
    createdAt: Date;
    updatedAt: Date;
}
