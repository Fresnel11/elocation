export declare enum ArticleStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class KnowledgeBaseArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    status: ArticleStatus;
    viewCount: number;
    helpfulCount: number;
    notHelpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    displayOrder: number;
    isActive: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
