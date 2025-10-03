import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { UploadController } from './controllers/upload.controller';
import { CommonController } from './common.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [UploadController, CommonController],
  providers: [UploadService],
  exports: [UploadService],
})
export class CommonModule {}