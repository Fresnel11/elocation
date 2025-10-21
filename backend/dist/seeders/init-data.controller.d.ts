import { SeederService } from './seeder.service';
import { UpdateCoordinatesSeeder } from './update-coordinates.seeder';
import { AdSeeder } from './ad.seeder';
export declare class InitDataController {
    private readonly seederService;
    private readonly updateCoordinatesSeeder;
    private readonly adSeeder;
    constructor(seederService: SeederService, updateCoordinatesSeeder: UpdateCoordinatesSeeder, adSeeder: AdSeeder);
    initBaseData(): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: string;
        message?: undefined;
    }>;
    initAllData(): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: string;
        message?: undefined;
    }>;
    seedDemoAds(): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: string;
        message?: undefined;
    }>;
    updateCoordinates(): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: string;
        message?: undefined;
    }>;
}
