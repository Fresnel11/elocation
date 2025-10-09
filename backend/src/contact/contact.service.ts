import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';
import { EmailService } from '../notifications/services/email.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<void> {
    await this.contactRepository.update(id, { isRead: true });
  }

  async reply(id: number, replyDto: ReplyContactDto): Promise<void> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new Error('Contact not found');
    }

    // Créer le contenu HTML de l'email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Réponse de l'équipe eLocation</h2>
        <p>Bonjour ${contact.name},</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${replyDto.message.replace(/\n/g, '<br>')}
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 14px;">
          <p><strong>Votre message original :</strong></p>
          <p><strong>Sujet :</strong> ${contact.subject}</p>
          <p>${contact.message.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Cordialement,<br>
          L'équipe eLocation Bénin<br>
          <a href="mailto:elocationcontact@gmail.com">elocationcontact@gmail.com</a>
        </p>
      </div>
    `;

    // Envoyer l'email de réponse
    await this.emailService.sendEmail(
      contact.email,
      replyDto.subject,
      html
    );

    // Marquer comme lu
    await this.markAsRead(id);
  }
}