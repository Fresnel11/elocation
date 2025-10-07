import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ad.entity';
export declare class FavoritesService {
    private favoriteRepository;
    private userRepository;
    private adRepository;
    constructor(favoriteRepository: Repository<Favorite>, userRepository: Repository<User>, adRepository: Repository<Ad>);
    getUserFavorites(userId: string): Promise<Favorite[]>;
    addToFavorites(userId: string, adId: string): Promise<Favorite>;
    removeFromFavorites(userId: string, adId: string): Promise<{
        message: string;
    }>;
    isFavorite(userId: string, adId: string): Promise<{
        isFavorite: boolean;
    }>;
}
