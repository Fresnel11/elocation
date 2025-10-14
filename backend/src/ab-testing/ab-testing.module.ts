import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ABTestingService } from './ab-testing.service';
import { ABTestingController } from './ab-testing.controller';
import { ABTest } from './entities/ab-test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ABTest])],
  controllers: [ABTestingController],
  providers: [ABTestingService],
  exports: [ABTestingService],
})
export class ABTestingModule {}