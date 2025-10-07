import { IsEnum, IsBoolean } from 'class-validator';
import { NotificationType } from '../entities/notification-preference.entity';

export class UpdateNotificationPreferenceDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsBoolean()
  emailEnabled: boolean;

  @IsBoolean()
  pushEnabled: boolean;
}