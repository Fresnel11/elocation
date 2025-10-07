export declare enum EmailTemplateType {
    WELCOME = "welcome",
    BOOKING_CONFIRMATION = "booking_confirmation",
    BOOKING_CANCELLED = "booking_cancelled",
    AD_APPROVED = "ad_approved",
    AD_REJECTED = "ad_rejected",
    REVIEW_NOTIFICATION = "review_notification",
    PASSWORD_RESET = "password_reset"
}
export declare class EmailTemplate {
    id: string;
    type: EmailTemplateType;
    subject: string;
    htmlContent: string;
    textContent: string;
    isActive: boolean;
    variables: string[];
    createdAt: Date;
    updatedAt: Date;
}
