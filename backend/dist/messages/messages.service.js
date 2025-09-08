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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
let MessagesService = class MessagesService {
    constructor(conversationRepository, messageRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }
    async sendMessage(createMessageDto, senderId) {
        let conversation = await this.findOrCreateConversation(senderId, createMessageDto.recipientId);
        const message = this.messageRepository.create({
            content: createMessageDto.content,
            sender: { id: senderId },
            conversation: { id: conversation.id }
        });
        return this.messageRepository.save(message);
    }
    async getConversations(userId) {
        return this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.user1', 'user1')
            .leftJoinAndSelect('conversation.user2', 'user2')
            .leftJoinAndSelect('conversation.messages', 'message')
            .leftJoinAndSelect('message.sender', 'sender')
            .where('conversation.user1Id = :userId OR conversation.user2Id = :userId', { userId })
            .orderBy('conversation.updatedAt', 'DESC')
            .addOrderBy('message.createdAt', 'ASC')
            .getMany();
    }
    async getMessages(conversationId, userId) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['user1', 'user2']
        });
        if (!conversation || (conversation.user1.id !== userId && conversation.user2.id !== userId)) {
            throw new Error('Conversation non trouvée ou accès non autorisé');
        }
        return this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            relations: ['sender'],
            order: { createdAt: 'ASC' }
        });
    }
    async markAsRead(conversationId, userId) {
        await this.messageRepository
            .createQueryBuilder()
            .update(message_entity_1.Message)
            .set({ isRead: true })
            .where('conversationId = :conversationId', { conversationId })
            .andWhere('senderId != :userId', { userId })
            .execute();
    }
    async findOrCreateConversation(user1Id, user2Id) {
        let conversation = await this.conversationRepository
            .createQueryBuilder('conversation')
            .where('(conversation.user1Id = :user1Id AND conversation.user2Id = :user2Id)', { user1Id, user2Id })
            .orWhere('(conversation.user1Id = :user2Id AND conversation.user2Id = :user1Id)', { user1Id: user2Id, user2Id: user1Id })
            .getOne();
        if (!conversation) {
            conversation = this.conversationRepository.create({
                user1: { id: user1Id },
                user2: { id: user2Id }
            });
            conversation = await this.conversationRepository.save(conversation);
        }
        return conversation;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map