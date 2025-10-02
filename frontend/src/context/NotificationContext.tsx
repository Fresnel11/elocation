import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read?: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connexion WebSocket
    const newSocket = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to notifications server');
    });

    newSocket.on('connected', (data) => {
      console.log('WebSocket authenticated:', data);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    newSocket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Garder max 50
      setUnreadCount(prev => prev + 1);
      
      // Notification browser si permission accordée
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from notifications server');
    });

    setSocket(newSocket);

    // Demander permission pour notifications browser
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.read ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      socket,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};