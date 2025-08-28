import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { RoleSeeder } from './role.seeder';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleSeeder, SeederService],
  exports: [SeederService],
})
export class SeederModule {}