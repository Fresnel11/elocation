import { PriceAlertsService } from './price-alerts.service';
export declare class PriceAlertsController {
    private readonly priceAlertsService;
    constructor(priceAlertsService: PriceAlertsService);
    getUserPriceAlerts(req: any): Promise<import("./entities/price-alert.entity").PriceAlert[]>;
    markAsRead(id: string): Promise<void>;
}
