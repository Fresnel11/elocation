import { IsString, IsUUID, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  receiverId: string;

  @IsOptional()
  @IsUUID()
  adId?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsIn(['text', 'image'])
  messageType?: 'text' | 'image';

  @IsOptional()
  isEncrypted?: boolean;
}