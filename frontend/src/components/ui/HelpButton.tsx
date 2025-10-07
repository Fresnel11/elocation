import React, { useState } from 'react';
import { HelpCircle, MessageCircle, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChatWidget } from './ChatWidget';

export const HelpButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const helpOptions = [
    {
      title: 'Centre d\'aide',
      description: 'FAQ et guides',
      icon: HelpCircle,
      link: '/support'
    },
    {
      title: 'Chat support',
      description: 'Aide en direct',
      icon: MessageCircle,
      action: () => {
        setShowChat(true);
        setIsOpen(false);
      }
    },
    {
      title: 'Créer un ticket',
      description: 'Signaler un problème',
      icon: FileText,
      link: '/support/tickets'
    }
  ];

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40">
        {isOpen && (
          <div className="mb-4 bg-white rounded-lg shadow-lg border p-2 min-w-48">
            {helpOptions.map((option) => {
              const Icon = option.icon;
              const content = (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{option.title}</p>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </div>
              );

              return option.link ? (
                <Link key={option.title} to={option.link} onClick={() => setIsOpen(false)}>
                  {content}
                </Link>
              ) : (
                <div key={option.title} onClick={option.action}>
                  {content}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all ${
            isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <HelpCircle className="h-6 w-6" />
          )}
        </button>
      </div>

      {showChat && (
        <ChatWidget onClose={() => setShowChat(false)} />
      )}
    </>
  );
};