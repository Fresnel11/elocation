import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { SystemSetting } from './entities/system-setting.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Category } from '../categories/entities/category.entity';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { Review } from '../reviews/entities/review.entity';
import { Report } from '../reports/entities/report.entity';
import { EmailTemplate } from '../email-templates/entities/email-template.entity';
import { SupportTicket, TicketMessage } from '../support/entities/support-ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ad, Booking, SystemSetting, ActivityLog, Role, Permission, Category, SubCategory, Review, Report, EmailTemplate, SupportTicket, TicketMessage]),
    PermissionsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}