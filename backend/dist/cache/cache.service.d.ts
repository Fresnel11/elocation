export declare class CacheService {
    private cache;
    private readonly DEFAULT_TTL;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    generateCacheKey(prefix: string, params: Record<string, any>): string;
}
