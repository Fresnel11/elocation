import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ABTest } from './entities/ab-test.entity';

@Injectable()
export class ABTestingService {
  constructor(
    @InjectRepository(ABTest)
    private abTestRepository: Repository<ABTest>,
  ) {}

  async createTest(data: Partial<ABTest>): Promise<ABTest> {
    const test = this.abTestRepository.create({
      ...data,
      metrics: {
        A: { views: 0, clicks: 0, conversions: 0 },
        B: { views: 0, clicks: 0, conversions: 0 }
      }
    });
    return this.abTestRepository.save(test);
  }

  async getActiveTests(): Promise<ABTest[]> {
    return this.abTestRepository.find({ where: { isActive: true } });
  }

  async getAllTests(): Promise<ABTest[]> {
    return this.abTestRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getTestById(id: string): Promise<ABTest> {
    return this.abTestRepository.findOne({ where: { id } });
  }

  async updateTest(id: string, data: Partial<ABTest>): Promise<ABTest> {
    await this.abTestRepository.update(id, data);
    return this.getTestById(id);
  }

  async deleteTest(id: string): Promise<void> {
    await this.abTestRepository.delete(id);
  }

  async getAlgorithmForUser(userId: string): Promise<{ algorithm: 'A' | 'B'; config: any } | null> {
    const activeTests = await this.getActiveTests();
    if (activeTests.length === 0) return null;

    const test = activeTests[0]; // Utiliser le premier test actif
    const userHash = this.hashUserId(userId);
    const variant = userHash < test.trafficSplit ? 'A' : 'B';

    return {
      algorithm: variant,
      config: test.algorithms[variant].config
    };
  }

  async trackMetric(testId: string, variant: 'A' | 'B', metric: 'views' | 'clicks' | 'conversions'): Promise<void> {
    const test = await this.getTestById(testId);
    if (!test) return;

    test.metrics[variant][metric]++;
    await this.abTestRepository.save(test);
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }

  async getTestResults(testId: string): Promise<any> {
    const test = await this.getTestById(testId);
    if (!test) return null;

    const { A, B } = test.metrics;
    
    return {
      test: {
        id: test.id,
        name: test.name,
        description: test.description,
        trafficSplit: test.trafficSplit
      },
      results: {
        A: {
          ...A,
          ctr: A.views > 0 ? (A.clicks / A.views * 100).toFixed(2) : '0.00',
          conversionRate: A.clicks > 0 ? (A.conversions / A.clicks * 100).toFixed(2) : '0.00'
        },
        B: {
          ...B,
          ctr: B.views > 0 ? (B.clicks / B.views * 100).toFixed(2) : '0.00',
          conversionRate: B.clicks > 0 ? (B.conversions / B.clicks * 100).toFixed(2) : '0.00'
        }
      }
    };
  }
}