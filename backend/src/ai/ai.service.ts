import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async enhanceDescription(originalDescription: string, adType: string = 'immobilier'): Promise<string> {
    // Cette méthode est maintenant gérée côté frontend avec Puter.js
    return originalDescription;
  }
}