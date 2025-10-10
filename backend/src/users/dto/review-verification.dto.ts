import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VerificationStatus } from '../entities/user-verification.entity';

export class ReviewVerificationDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}