import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('enhance-description')
  async enhanceDescription(@Body() body: { description: string; adType?: string }) {
    const enhancedDescription = await this.aiService.enhanceDescription(
      body.description,
      body.adType
    );
    
    return { enhancedDescription };
  }
}