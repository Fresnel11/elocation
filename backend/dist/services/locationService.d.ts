export declare class LocationService {
    private static readonly CITY_HIERARCHY;
    static getUserCityFromIP(ip: string): string | null;
    static getNearbyCities(userCity: string): string[];
    static calculateCityPriority(userCity: string, adCity: string): number;
}
