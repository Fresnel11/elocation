import { ABTestingService } from './ab-testing.service';
export declare class ABTestingController {
    private readonly abTestingService;
    constructor(abTestingService: ABTestingService);
    createTest(data: any): Promise<import("./entities/ab-test.entity").ABTest>;
    getAllTests(): Promise<import("./entities/ab-test.entity").ABTest[]>;
    getActiveTests(): Promise<import("./entities/ab-test.entity").ABTest[]>;
    getTestById(id: string): Promise<import("./entities/ab-test.entity").ABTest>;
    getTestResults(id: string): Promise<any>;
    updateTest(id: string, data: any): Promise<import("./entities/ab-test.entity").ABTest>;
    deleteTest(id: string): Promise<{
        success: boolean;
    }>;
    trackMetric(id: string, variant: 'A' | 'B', metric: 'views' | 'clicks' | 'conversions'): Promise<{
        success: boolean;
    }>;
}
