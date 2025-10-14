import React from 'react';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Ad } from '../types/ad';
import SaveForOfflineButton from './SaveForOfflineButton';

interface AdCardProps {
  ad: Ad;
  onClick?: () => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-visible">
        {ad.photos && ad.photos.length > 0 && (
          <img 
            src={ad.photos[0]} 
            alt={ad.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        <div className="absolute top-3 right-3 z-10">
          <SaveForOfflineButton adId={ad.id} compact />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{ad.title}</h3>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{ad.location}</span>
        </div>
        
        <p className="text-2xl font-bold text-blue-600 mb-2">
          {ad.price.toLocaleString()} FCFA
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{ad.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;