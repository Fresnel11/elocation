export declare class EmailService {
    private transporter;
    constructor();
    sendOtpEmail(email: string, code: string, firstName: string): Promise<void>;
    sendPasswordResetEmail(email: string, code: string, firstName: string): Promise<void>;
}
