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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQItem = exports.KnowledgeBaseArticle = exports.ArticleStatus = void 0;
const typeorm_1 = require("typeorm");
var ArticleStatus;
(function (ArticleStatus) {
    ArticleStatus["DRAFT"] = "draft";
    ArticleStatus["PUBLISHED"] = "published";
    ArticleStatus["ARCHIVED"] = "archived";
})(ArticleStatus || (exports.ArticleStatus = ArticleStatus = {}));
let KnowledgeBaseArticle = class KnowledgeBaseArticle {
};
exports.KnowledgeBaseArticle = KnowledgeBaseArticle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KnowledgeBaseArticle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KnowledgeBaseArticle.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], KnowledgeBaseArticle.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KnowledgeBaseArticle.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], KnowledgeBaseArticle.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.PUBLISHED }),
    __metadata("design:type", String)
], KnowledgeBaseArticle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', default: 0 }),
    __metadata("design:type", Number)
], KnowledgeBaseArticle.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'helpful_count', default: 0 }),
    __metadata("design:type", Number)
], KnowledgeBaseArticle.prototype, "helpfulCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'not_helpful_count', default: 0 }),
    __metadata("design:type", Number)
], KnowledgeBaseArticle.prototype, "notHelpfulCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KnowledgeBaseArticle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KnowledgeBaseArticle.prototype, "updatedAt", void 0);
exports.KnowledgeBaseArticle = KnowledgeBaseArticle = __decorate([
    (0, typeorm_1.Entity)('knowledge_base_articles')
], KnowledgeBaseArticle);
let FAQItem = class FAQItem {
};
exports.FAQItem = FAQItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FAQItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FAQItem.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], FAQItem.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FAQItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', default: 0 }),
    __metadata("design:type", Number)
], FAQItem.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], FAQItem.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', default: 0 }),
    __metadata("design:type", Number)
], FAQItem.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FAQItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FAQItem.prototype, "updatedAt", void 0);
exports.FAQItem = FAQItem = __decorate([
    (0, typeorm_1.Entity)('faq_items')
], FAQItem);
//# sourceMappingURL=knowledge-base.entity.js.map