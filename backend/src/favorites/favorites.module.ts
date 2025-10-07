import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './entities/favorite.entity';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Ad])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}