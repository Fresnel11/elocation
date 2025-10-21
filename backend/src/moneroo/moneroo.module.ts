import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MonerooController } from './moneroo.controller';
import { MonerooService } from './moneroo.service';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule,
    forwardRef(() => BookingsModule),
  ],
  controllers: [MonerooController],
  providers: [MonerooService],
  exports: [MonerooService],
})
export class MonerooModule {}