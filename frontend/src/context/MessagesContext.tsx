import React, { createContext, useContext, useState, useEffect } from 'react';
import { messagesService } from '../services/messagesService';
import { websocketService } from '../services/websocketService';
import { useAuth } from './AuthContext';

interface MessagesContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    
    try {
      const data = await messagesService.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Erreur lors du chargement du nombre de messages non lus:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // Connecter WebSocket seulement si pas déjà connecté
      if (!websocketService.isConnected) {
        websocketService.connect();
      }
      
      refreshUnreadCount();
      
      // Écouter les mises à jour du compteur via WebSocket
      const handleUnreadCountUpdate = (data: any) => {
        setUnreadCount(data.unreadCount);
      };
      
      websocketService.on('unread_count_update', handleUnreadCountUpdate);
      
      return () => {
        websocketService.off('unread_count_update', handleUnreadCountUpdate);
      };
    }
  }, [user]);

  return (
    <MessagesContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};