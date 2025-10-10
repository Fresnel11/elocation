import React, { useState, useRef, useEffect } from 'react';
import { Settings, Shield, BarChart3, Download, LogOut, UserX, Flag, Copy, Star, EyeOff, QrCode, UserPlus } from 'lucide-react';

interface ProfileDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
  userName: string;
  profileUrl: string;
}

export const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  isOpen,
  onClose,
  isOwner,
  userName,
  profileUrl
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      onClose();
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const ownerMenuItems = [
    { icon: Settings, label: 'Paramètres du compte', action: () => console.log('Paramètres') },
    { icon: Shield, label: 'Confidentialité', action: () => console.log('Confidentialité') },
    { icon: BarChart3, label: 'Statistiques du profil', action: () => console.log('Statistiques') },
    { icon: Download, label: 'Exporter les données', action: () => console.log('Exporter') },
    { icon: LogOut, label: 'Se déconnecter', action: () => console.log('Déconnexion'), danger: true }
  ];

  const visitorMenuItems = [
    { icon: Copy, label: 'Copier le lien du profil', action: handleCopyLink },
    { icon: Star, label: 'Ajouter aux favoris', action: () => console.log('Favoris') },
    { icon: UserPlus, label: 'Ajouter aux contacts', action: () => console.log('Contacts') },
    { icon: QrCode, label: 'Partager via QR Code', action: () => console.log('QR Code') },
    { icon: EyeOff, label: 'Masquer ce profil', action: () => console.log('Masquer') },
    { icon: UserX, label: 'Bloquer cet utilisateur', action: () => console.log('Bloquer'), danger: true },
    { icon: Flag, label: 'Signaler le profil', action: () => console.log('Signaler'), danger: true }
  ];

  const menuItems = isOwner ? ownerMenuItems : visitorMenuItems;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-12 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-56 z-50"
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.action();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-left whitespace-nowrap ${
            item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </button>
      ))}
    </div>
  );
};