import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyContactDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}