import { DocumentType } from '../entities/user-verification.entity';
export declare class SubmitVerificationDto {
    selfiePhoto: string;
    documentType: DocumentType;
    documentFrontPhoto: string;
    documentBackPhoto?: string;
}
