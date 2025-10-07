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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendEmail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@elocation.bj',
                to,
                subject,
                html,
            });
        }
        catch (error) {
            console.error('Email sending failed:', error);
        }
    }
    async sendNewAdMatchEmail(userEmail, userName, ads) {
        const html = `
      <h2>Nouvelles annonces correspondant à vos critères</h2>
      <p>Bonjour ${userName},</p>
      <p>Nous avons trouvé ${ads.length} nouvelle(s) annonce(s) qui pourrait vous intéresser :</p>
      ${ads.map(ad => `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
          <h3>${ad.title}</h3>
          <p><strong>Prix:</strong> ${ad.price} FCFA/mois</p>
          <p><strong>Localisation:</strong> ${ad.location}</p>
          <p>${ad.description.substring(0, 100)}...</p>
        </div>
      `).join('')}
      <p>Consultez ces annonces sur eLocation Bénin.</p>
    `;
        await this.sendEmail(userEmail, 'Nouvelles annonces disponibles', html);
    }
    async sendBookingReminderEmail(userEmail, userName, booking) {
        const html = `
      <h2>Rappel de réservation</h2>
      <p>Bonjour ${userName},</p>
      <p>Votre réservation pour "${booking.ad.title}" commence demain.</p>
      <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
      <p><strong>Localisation:</strong> ${booking.ad.location}</p>
      <p>N'oubliez pas de contacter le propriétaire si nécessaire.</p>
    `;
        await this.sendEmail(userEmail, 'Rappel de réservation', html);
    }
    async sendBookingStatusChangeEmail(userEmail, userName, booking) {
        const statusLabels = {
            confirmed: 'confirmée',
            cancelled: 'annulée',
            completed: 'terminée'
        };
        const html = `
      <h2>Changement de statut de réservation</h2>
      <p>Bonjour ${userName},</p>
      <p>Le statut de votre réservation pour "${booking.ad.title}" a été mis à jour.</p>
      <p><strong>Nouveau statut:</strong> ${statusLabels[booking.status] || booking.status}</p>
      <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
    `;
        await this.sendEmail(userEmail, 'Mise à jour de réservation', html);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map