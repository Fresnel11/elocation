"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABTestingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ab_test_entity_1 = require("./entities/ab-test.entity");
let ABTestingService = class ABTestingService {
    constructor(abTestRepository) {
        this.abTestRepository = abTestRepository;
    }
    async createTest(data) {
        const test = this.abTestRepository.create(Object.assign(Object.assign({}, data), { metrics: {
                A: { views: 0, clicks: 0, conversions: 0 },
                B: { views: 0, clicks: 0, conversions: 0 }
            } }));
        return this.abTestRepository.save(test);
    }
    async getActiveTests() {
        return this.abTestRepository.find({ where: { isActive: true } });
    }
    async getAllTests() {
        return this.abTestRepository.find({ order: { createdAt: 'DESC' } });
    }
    async getTestById(id) {
        return this.abTestRepository.findOne({ where: { id } });
    }
    async updateTest(id, data) {
        await this.abTestRepository.update(id, data);
        return this.getTestById(id);
    }
    async deleteTest(id) {
        await this.abTestRepository.delete(id);
    }
    async getAlgorithmForUser(userId) {
        const activeTests = await this.getActiveTests();
        if (activeTests.length === 0)
            return null;
        const test = activeTests[0];
        const userHash = this.hashUserId(userId);
        const variant = userHash < test.trafficSplit ? 'A' : 'B';
        return {
            algorithm: variant,
            config: test.algorithms[variant].config
        };
    }
    async trackMetric(testId, variant, metric) {
        const test = await this.getTestById(testId);
        if (!test)
            return;
        test.metrics[variant][metric]++;
        await this.abTestRepository.save(test);
    }
    hashUserId(userId) {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash) % 100;
    }
    async getTestResults(testId) {
        const test = await this.getTestById(testId);
        if (!test)
            return null;
        const { A, B } = test.metrics;
        return {
            test: {
                id: test.id,
                name: test.name,
                description: test.description,
                trafficSplit: test.trafficSplit
            },
            results: {
                A: Object.assign(Object.assign({}, A), { ctr: A.views > 0 ? (A.clicks / A.views * 100).toFixed(2) : '0.00', conversionRate: A.clicks > 0 ? (A.conversions / A.clicks * 100).toFixed(2) : '0.00' }),
                B: Object.assign(Object.assign({}, B), { ctr: B.views > 0 ? (B.clicks / B.views * 100).toFixed(2) : '0.00', conversionRate: B.clicks > 0 ? (B.conversions / B.clicks * 100).toFixed(2) : '0.00' })
            }
        };
    }
};
exports.ABTestingService = ABTestingService;
exports.ABTestingService = ABTestingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ab_test_entity_1.ABTest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ABTestingService);
//# sourceMappingURL=ab-testing.service.js.map