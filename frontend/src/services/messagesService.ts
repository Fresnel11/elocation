import { api } from './api';

export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  imageUrl?: string;
  messageType: 'text' | 'image';
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
  };
  ad: {
    id: string;
    title: string;
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  user1: {
    id: string;
    firstName: string;
    lastName: string;
  };
  user2: {
    id: string;
    firstName: string;
    lastName: string;
  };
  ad: {
    id: string;
    title: string;
  };
  lastMessageContent: string;
  lastMessageAt: string;
  unreadCountUser1: number;
  unreadCountUser2: number;
}

export const messagesService = {
  async sendMessage(receiverId: string, adId: string, content: string, imageUrl?: string, messageType?: 'text' | 'image') {
    const response = await api.post('/messages', {
      receiverId,
      adId: adId || null,
      content,
      imageUrl,
      messageType: messageType || 'text'
    });
    return response.data;
  },

  async getConversations() {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  async getMessages(adId: string, otherUserId: string) {
    const endpoint = adId && adId !== '' 
      ? `/messages/conversation/${adId}/${otherUserId}`
      : `/messages/conversation/direct/${otherUserId}`;
    const response = await api.get(endpoint);
    return response.data;
  },

  async markAsRead(adId: string, otherUserId: string) {
    const endpoint = adId && adId !== '' 
      ? `/messages/mark-read/${adId}/${otherUserId}`
      : `/messages/mark-read/direct/${otherUserId}`;
    const response = await api.post(endpoint);
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/messages/unread-count');
    return response.data;
  }
};