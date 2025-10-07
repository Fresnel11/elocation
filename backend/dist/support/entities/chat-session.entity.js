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
exports.ChatMessage = exports.ChatSession = exports.ChatStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ChatStatus;
(function (ChatStatus) {
    ChatStatus["WAITING"] = "waiting";
    ChatStatus["ACTIVE"] = "active";
    ChatStatus["ENDED"] = "ended";
})(ChatStatus || (exports.ChatStatus = ChatStatus = {}));
let ChatSession = class ChatSession {
};
exports.ChatSession = ChatSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], ChatSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ChatSession.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agent_id', nullable: true }),
    __metadata("design:type", String)
], ChatSession.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'agent_id' }),
    __metadata("design:type", user_entity_1.User)
], ChatSession.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ChatStatus, default: ChatStatus.WAITING }),
    __metadata("design:type", String)
], ChatSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', nullable: true }),
    __metadata("design:type", Date)
], ChatSession.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ended_at', nullable: true }),
    __metadata("design:type", Date)
], ChatSession.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChatMessage, message => message.session),
    __metadata("design:type", Array)
], ChatSession.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ChatSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ChatSession.prototype, "updatedAt", void 0);
exports.ChatSession = ChatSession = __decorate([
    (0, typeorm_1.Entity)('chat_sessions')
], ChatSession);
let ChatMessage = class ChatMessage {
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ChatSession, session => session.messages),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", ChatSession)
], ChatMessage.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ChatMessage.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_agent', default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)('chat_messages')
], ChatMessage);
//# sourceMappingURL=chat-session.entity.js.map