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
exports.TicketMessage = exports.SupportTicket = exports.TicketPriority = exports.TicketStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "open";
    TicketStatus["IN_PROGRESS"] = "in_progress";
    TicketStatus["RESOLVED"] = "resolved";
    TicketStatus["CLOSED"] = "closed";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "low";
    TicketPriority["MEDIUM"] = "medium";
    TicketPriority["HIGH"] = "high";
    TicketPriority["URGENT"] = "urgent";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
let SupportTicket = class SupportTicket {
};
exports.SupportTicket = SupportTicket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupportTicket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_number', unique: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "ticketNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SupportTicket.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN }),
    __metadata("design:type", String)
], SupportTicket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM }),
    __metadata("design:type", String)
], SupportTicket.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], SupportTicket.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SupportTicket.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_to', nullable: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_to' }),
    __metadata("design:type", user_entity_1.User)
], SupportTicket.prototype, "assignedAgent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TicketMessage, message => message.ticket),
    __metadata("design:type", Array)
], SupportTicket.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SupportTicket.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SupportTicket.prototype, "updatedAt", void 0);
exports.SupportTicket = SupportTicket = __decorate([
    (0, typeorm_1.Entity)('support_tickets')
], SupportTicket);
let TicketMessage = class TicketMessage {
};
exports.TicketMessage = TicketMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TicketMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_id' }),
    __metadata("design:type", String)
], TicketMessage.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SupportTicket, ticket => ticket.messages),
    (0, typeorm_1.JoinColumn)({ name: 'ticket_id' }),
    __metadata("design:type", SupportTicket)
], TicketMessage.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], TicketMessage.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TicketMessage.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TicketMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_staff', default: false }),
    __metadata("design:type", Boolean)
], TicketMessage.prototype, "isStaff", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TicketMessage.prototype, "createdAt", void 0);
exports.TicketMessage = TicketMessage = __decorate([
    (0, typeorm_1.Entity)('ticket_messages')
], TicketMessage);
//# sourceMappingURL=support-ticket.entity.js.map