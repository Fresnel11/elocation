import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '../entities/user-verification.entity';

export class SubmitVerificationDto {
  @IsNotEmpty()
  @IsString()
  selfiePhoto: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsNotEmpty()
  @IsString()
  documentFrontPhoto: string;

  @IsOptional()
  @IsString()
  documentBackPhoto?: string;
}