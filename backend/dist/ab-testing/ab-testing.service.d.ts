import { Repository } from 'typeorm';
import { ABTest } from './entities/ab-test.entity';
export declare class ABTestingService {
    private abTestRepository;
    constructor(abTestRepository: Repository<ABTest>);
    createTest(data: Partial<ABTest>): Promise<ABTest>;
    getActiveTests(): Promise<ABTest[]>;
    getAllTests(): Promise<ABTest[]>;
    getTestById(id: string): Promise<ABTest>;
    updateTest(id: string, data: Partial<ABTest>): Promise<ABTest>;
    deleteTest(id: string): Promise<void>;
    getAlgorithmForUser(userId: string): Promise<{
        algorithm: 'A' | 'B';
        config: any;
    } | null>;
    trackMetric(testId: string, variant: 'A' | 'B', metric: 'views' | 'clicks' | 'conversions'): Promise<void>;
    private hashUserId;
    getTestResults(testId: string): Promise<any>;
}
