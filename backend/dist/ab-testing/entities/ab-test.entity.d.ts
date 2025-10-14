export declare class ABTest {
    id: string;
    name: string;
    description: string;
    algorithms: {
        A: {
            name: string;
            config: any;
        };
        B: {
            name: string;
            config: any;
        };
    };
    trafficSplit: number;
    isActive: boolean;
    metrics: {
        A: {
            views: number;
            clicks: number;
            conversions: number;
        };
        B: {
            views: number;
            clicks: number;
            conversions: number;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
