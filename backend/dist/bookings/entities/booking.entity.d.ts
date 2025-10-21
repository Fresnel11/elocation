import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    EXPIRED = "expired"
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
    paymentId: string;
    payoutId: string;
    paidAt: Date;
    fundsReleased: boolean;
    fundsReleasedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
