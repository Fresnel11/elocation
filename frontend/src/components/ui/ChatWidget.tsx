import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Bot } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  message: string;
  isAgent: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface ChatWidgetProps {
  onClose: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    startChatSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startChatSession = async () => {
    try {
      const response = await api.post('/support/chat/start');
      setSessionId(response.data.id);
      
      if (response.data.messages?.length > 0) {
        setMessages(response.data.messages);
      } else {
        // Message de bienvenue automatique
        setMessages([{
          id: 'welcome',
          message: 'Bonjour ! Je suis là pour vous aider. Comment puis-je vous assister aujourd\'hui ?',
          isAgent: true,
          createdAt: new Date().toISOString(),
          user: { firstName: 'Support', lastName: 'eLocation' }
        }]);
      }
    } catch (error) {
      console.error('Erreur démarrage chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    // Ajouter le message localement
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageText,
      isAgent: false,
      createdAt: new Date().toISOString(),
      user: { firstName: user?.firstName || 'Vous', lastName: user?.lastName || '' }
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      await api.post(`/support/chat/${sessionId}/message`, { message: messageText });
      
      // Simuler une réponse automatique (à remplacer par un vrai système)
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: 'Merci pour votre message. Un agent va vous répondre sous peu.',
          isAgent: true,
          createdAt: new Date().toISOString(),
          user: { firstName: 'Support', lastName: 'eLocation' }
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Support eLocation</h3>
            <p className="text-xs opacity-90">En ligne</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-700 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAgent ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] ${message.isAgent ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.isAgent
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm">{message.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-1">
                {message.isAgent ? 'Support' : 'Vous'} • {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isAgent ? 'order-1 mr-2 bg-blue-100' : 'order-2 ml-2 bg-gray-100'}`}>
              {message.isAgent ? (
                <Bot className="h-4 w-4 text-blue-600" />
              ) : (
                <User className="h-4 w-4 text-gray-600" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={sending}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};