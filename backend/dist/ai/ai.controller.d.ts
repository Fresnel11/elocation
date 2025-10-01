import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    enhanceDescription(body: {
        description: string;
        adType?: string;
    }): Promise<{
        enhancedDescription: string;
    }>;
}
