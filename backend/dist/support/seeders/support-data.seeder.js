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
exports.SupportDataSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const knowledge_base_entity_1 = require("../entities/knowledge-base.entity");
let SupportDataSeeder = class SupportDataSeeder {
    constructor(faqRepository, articleRepository) {
        this.faqRepository = faqRepository;
        this.articleRepository = articleRepository;
    }
    async seedFAQs() {
        const faqs = [
            {
                question: 'Comment publier une annonce ?',
                answer: 'Pour publier une annonce, connectez-vous à votre compte, cliquez sur "Publier une annonce" et remplissez le formulaire avec les détails de votre bien.',
                category: 'Annonces',
                displayOrder: 1
            },
            {
                question: 'Comment contacter un propriétaire ?',
                answer: 'Sur la page de l\'annonce, cliquez sur "Contacter le propriétaire" pour envoyer un message ou utilisez le bouton WhatsApp si disponible.',
                category: 'Location',
                displayOrder: 2
            },
            {
                question: 'Quels sont les frais de service ?',
                answer: 'La publication d\'annonces est gratuite. Nous prélevons une commission de 5% uniquement lors d\'une réservation confirmée.',
                category: 'Paiement',
                displayOrder: 3
            }
        ];
        for (const faqData of faqs) {
            const existing = await this.faqRepository.findOne({ where: { question: faqData.question } });
            if (!existing) {
                await this.faqRepository.save(faqData);
            }
        }
    }
    async seedArticles() {
        const articles = [
            {
                title: 'Guide complet pour publier votre première annonce',
                content: 'Ce guide vous accompagne étape par étape pour créer une annonce attractive et efficace sur eLocation.',
                category: 'Guides',
                tags: ['annonce', 'publication', 'guide']
            },
            {
                title: 'Conseils de sécurité pour les locataires',
                content: 'Découvrez nos recommandations pour une location en toute sécurité sur notre plateforme.',
                category: 'Sécurité',
                tags: ['sécurité', 'location', 'conseils']
            }
        ];
        for (const articleData of articles) {
            const existing = await this.articleRepository.findOne({ where: { title: articleData.title } });
            if (!existing) {
                await this.articleRepository.save(articleData);
            }
        }
    }
};
exports.SupportDataSeeder = SupportDataSeeder;
exports.SupportDataSeeder = SupportDataSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(knowledge_base_entity_1.FAQItem)),
    __param(1, (0, typeorm_1.InjectRepository)(knowledge_base_entity_1.KnowledgeBaseArticle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SupportDataSeeder);
//# sourceMappingURL=support-data.seeder.js.map