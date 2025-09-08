interface Coordinates {
    latitude: number;
    longitude: number;
}
export declare class GeocodingService {
    private readonly cities;
    extractCoordinates(location: string): Coordinates | null;
}
export {};
