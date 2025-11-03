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
const message_entity_1 = require("./entities/message.entity");
const conversation_entity_1 = require("./entities/conversation.entity");
const user_entity_1 = require("../users/entities/user.entity");
const ad_entity_1 = require("../ads/entities/ad.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let MessagesService = class MessagesService {
    constructor(messageRepository, conversationRepository, userRepository, adRepository, notificationsService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.adRepository = adRepository;
        this.notificationsService = notificationsService;
    }
    async sendMessage(senderId, createMessageDto) {
        const { content, receiverId, adId, imageUrl, messageType, isEncrypted } = createMessageDto;
        let ad = null;
        if (adId) {
            ad = await this.adRepository.findOne({ where: { id: adId } });
            if (!ad) {
                throw new common_1.NotFoundException('Annonce non trouvée');
            }
        }
        const receiver = await this.userRepository.findOne({ where: { id: receiverId } });
        if (!receiver) {
            throw new common_1.NotFoundException('Destinataire non trouvé');
        }
        const message = this.messageRepository.create({
            content,
            senderId,
            receiverId,
            adId: adId || null,
            imageUrl: imageUrl || null,
            messageType: messageType || 'text',
            isEncrypted: isEncrypted || false,
        });
        const savedMessage = await this.messageRepository.save(message);
        const messageWithRelations = await this.messageRepository.findOne({
            where: { id: savedMessage.id },
            relations: ['sender', 'receiver', 'ad']
        });
        const conversation = await this.updateConversation(senderId, receiverId, adId || null, content);
        const sender = await this.userRepository.findOne({ where: { id: senderId } });
        if (sender) {
            const notificationMessage = ad
                ? `${sender.firstName} vous a envoyé un message concernant "${ad.title}"`
                : `${sender.firstName} vous a envoyé un message`;
            await this.notificationsService.createNotification(receiverId, notification_entity_1.NotificationType.NEW_MESSAGE, 'Nouveau message', notificationMessage, adId || undefined);
        }
        return messageWithRelations || savedMessage;
    }
    async getConversations(userId) {
        const conversations = await this.conversationRepository.find({
            where: [
                { user1Id: userId },
                { user2Id: userId }
            ],
            relations: ['user1', 'user2', 'ad'],
            order: { lastMessageAt: 'DESC' }
        });
        return conversations;
    }
    async getMessages(userId, adId, otherUserId) {
        console.log('getMessages called with:', { userId, adId, otherUserId });
        const whereConditions = adId
            ? [
                { user1Id: userId, user2Id: otherUserId, adId },
                { user1Id: otherUserId, user2Id: userId, adId }
            ]
            : [
                { user1Id: userId, user2Id: otherUserId, adId: (0, typeorm_2.IsNull)() },
                { user1Id: otherUserId, user2Id: userId, adId: (0, typeorm_2.IsNull)() }
            ];
        const conversation = await this.conversationRepository.findOne({
            where: whereConditions
        });
        const messageWhereConditions = adId
            ? [
                { senderId: userId, receiverId: otherUserId, adId },
                { senderId: otherUserId, receiverId: userId, adId }
            ]
            : [
                { senderId: userId, receiverId: otherUserId, adId: (0, typeorm_2.IsNull)() },
                { senderId: otherUserId, receiverId: userId, adId: (0, typeorm_2.IsNull)() }
            ];
        const messages = await this.messageRepository.find({
            where: messageWhereConditions,
            relations: ['sender', 'receiver', 'ad'],
            order: { createdAt: 'ASC' }
        });
        console.log('Messages found:', messages.length);
        console.log('Message conditions:', messageWhereConditions);
        await this.markMessagesAsRead(userId, otherUserId, adId);
        return messages;
    }
    async markMessagesAsRead(userId, otherUserId, adId) {
        const messageWhere = adId
            ? { senderId: otherUserId, receiverId: userId, adId, isRead: false }
            : { senderId: otherUserId, receiverId: userId, adId: (0, typeorm_2.IsNull)(), isRead: false };
        await this.messageRepository.update(messageWhere, { isRead: true });
        const conversationWhere1 = adId
            ? { user1Id: otherUserId, user2Id: userId, adId }
            : { user1Id: otherUserId, user2Id: userId, adId: (0, typeorm_2.IsNull)() };
        const conversationWhere2 = adId
            ? { user1Id: userId, user2Id: otherUserId, adId }
            : { user1Id: userId, user2Id: otherUserId, adId: (0, typeorm_2.IsNull)() };
        await this.conversationRepository.update(conversationWhere1, { unreadCountUser2: 0 });
        await this.conversationRepository.update(conversationWhere2, { unreadCountUser1: 0 });
    }
    async getUnreadCount(userId) {
        const conversations = await this.conversationRepository.find({
            where: [
                { user1Id: userId },
                { user2Id: userId }
            ]
        });
        let totalUnread = 0;
        conversations.forEach(conv => {
            if (conv.user1Id === userId) {
                totalUnread += conv.unreadCountUser1;
            }
            else {
                totalUnread += conv.unreadCountUser2;
            }
        });
        return { unreadCount: totalUnread };
    }
    async updateConversation(senderId, receiverId, adId, content) {
        const whereConditions = adId
            ? [
                { user1Id: senderId, user2Id: receiverId, adId },
                { user1Id: receiverId, user2Id: senderId, adId }
            ]
            : [
                { user1Id: senderId, user2Id: receiverId, adId: (0, typeorm_2.IsNull)() },
                { user1Id: receiverId, user2Id: senderId, adId: (0, typeorm_2.IsNull)() }
            ];
        let conversation = await this.conversationRepository.findOne({
            where: whereConditions
        });
        if (!conversation) {
            conversation = this.conversationRepository.create({
                user1Id: senderId,
                user2Id: receiverId,
                adId,
                lastMessageContent: content,
                lastMessageAt: new Date(),
                unreadCountUser2: 1
            });
        }
        else {
            conversation.lastMessageContent = content;
            conversation.lastMessageAt = new Date();
            if (conversation.user1Id === senderId) {
                conversation.unreadCountUser2++;
            }
            else {
                conversation.unreadCountUser1++;
            }
        }
        const savedConversation = await this.conversationRepository.save(conversation);
        return savedConversation;
    }
    async createOrGetConversation(senderId, receiverId, adId) {
        const receiver = await this.userRepository.findOne({ where: { id: receiverId } });
        if (!receiver) {
            throw new common_1.NotFoundException('Destinataire non trouvé');
        }
        if (adId) {
            const ad = await this.adRepository.findOne({ where: { id: adId } });
            if (!ad) {
                throw new common_1.NotFoundException('Annonce non trouvée');
            }
        }
        const actualAdId = adId || null;
        const whereConditions = actualAdId
            ? [
                { user1Id: senderId, user2Id: receiverId, adId: actualAdId },
                { user1Id: receiverId, user2Id: senderId, adId: actualAdId }
            ]
            : [
                { user1Id: senderId, user2Id: receiverId, adId: (0, typeorm_2.IsNull)() },
                { user1Id: receiverId, user2Id: senderId, adId: (0, typeorm_2.IsNull)() }
            ];
        let conversation = await this.conversationRepository.findOne({
            where: whereConditions,
            relations: ['user1', 'user2', 'ad']
        });
        if (!conversation) {
            conversation = this.conversationRepository.create({
                user1Id: senderId,
                user2Id: receiverId,
                adId: actualAdId,
                lastMessageContent: '',
                lastMessageAt: new Date(),
                unreadCountUser1: 0,
                unreadCountUser2: 0
            });
            conversation = await this.conversationRepository.save(conversation);
            conversation = await this.conversationRepository.findOne({
                where: { id: conversation.id },
                relations: ['user1', 'user2', 'ad']
            });
        }
        return {
            conversationId: conversation.id,
            conversation
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(ad_entity_1.Ad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map