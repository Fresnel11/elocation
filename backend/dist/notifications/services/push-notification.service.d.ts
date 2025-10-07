export declare class PushNotificationService {
    constructor();
    sendPushNotification(subscription: any, title: string, message: string, data?: any): Promise<void>;
    sendBookingRequestPush(subscription: any, adTitle: string, tenantName: string): Promise<void>;
    sendBookingConfirmedPush(subscription: any, adTitle: string): Promise<void>;
    sendNewAdMatchPush(subscription: any, alertName: string, adCount: number): Promise<void>;
}
