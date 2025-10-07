import { Repository } from 'typeorm';
import { FAQItem, KnowledgeBaseArticle } from '../entities/knowledge-base.entity';
export declare class SupportDataSeeder {
    private faqRepository;
    private articleRepository;
    constructor(faqRepository: Repository<FAQItem>, articleRepository: Repository<KnowledgeBaseArticle>);
    seedFAQs(): Promise<void>;
    seedArticles(): Promise<void>;
}
