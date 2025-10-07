import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    getUserFavorites(req: any): Promise<import("./entities/favorite.entity").Favorite[]>;
    addToFavorites(adId: string, req: any): Promise<import("./entities/favorite.entity").Favorite>;
    removeFromFavorites(adId: string, req: any): Promise<{
        message: string;
    }>;
    isFavorite(adId: string, req: any): Promise<{
        isFavorite: boolean;
    }>;
}
