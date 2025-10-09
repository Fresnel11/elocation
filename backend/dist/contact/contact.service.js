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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_entity_1 = require("./entities/contact.entity");
const email_service_1 = require("../notifications/services/email.service");
let ContactService = class ContactService {
    constructor(contactRepository, emailService) {
        this.contactRepository = contactRepository;
        this.emailService = emailService;
    }
    async create(createContactDto) {
        const contact = this.contactRepository.create(createContactDto);
        return this.contactRepository.save(contact);
    }
    async findAll() {
        return this.contactRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async markAsRead(id) {
        await this.contactRepository.update(id, { isRead: true });
    }
    async reply(id, replyDto) {
        const contact = await this.contactRepository.findOne({ where: { id } });
        if (!contact) {
            throw new Error('Contact not found');
        }
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
        await this.emailService.sendEmail(contact.email, replyDto.subject, html);
        await this.markAsRead(id);
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], ContactService);
//# sourceMappingURL=contact.service.js.map