import { IsString } from 'class-validator';

export class CreateRequestCommentDto {
  @IsString()
  content: string;
}