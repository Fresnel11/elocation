import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAQItem, KnowledgeBaseArticle } from '../entities/knowledge-base.entity';

@Injectable()
export class SupportDataSeeder {
  constructor(
    @InjectRepository(FAQItem)
    private faqRepository: Repository<FAQItem>,
    @InjectRepository(KnowledgeBaseArticle)
    private articleRepository: Repository<KnowledgeBaseArticle>,
  ) {}

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
}