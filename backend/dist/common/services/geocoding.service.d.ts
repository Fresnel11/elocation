export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface GeocodeResult {
    coordinates: Coordinates;
    formattedAddress: string;
    city?: string;
    country?: string;
}
export declare class GeocodingService {
    geocodeAddress(address: string): Promise<GeocodeResult | null>;
    reverseGeocode(latitude: number, longitude: number): Promise<string>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    private deg2rad;
    private getBeninLocations;
    findNearbyAds(latitude: number, longitude: number, radiusKm?: number): Promise<{
        minLatitude: number;
        maxLatitude: number;
        minLongitude: number;
        maxLongitude: number;
    }>;
}
