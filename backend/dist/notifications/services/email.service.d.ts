export declare class EmailService {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    sendNewAdMatchEmail(userEmail: string, userName: string, ads: any[]): Promise<void>;
    sendBookingReminderEmail(userEmail: string, userName: string, booking: any): Promise<void>;
    sendBookingStatusChangeEmail(userEmail: string, userName: string, booking: any): Promise<void>;
}
