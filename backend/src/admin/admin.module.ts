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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ad, Booking, SystemSetting, ActivityLog, Role, Permission]),
    PermissionsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}