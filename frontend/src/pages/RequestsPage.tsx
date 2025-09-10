import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Clock, MessageCircle, User, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CreateRequestModal } from '../components/ui/CreateRequestModal';

interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  maxBudget?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  desiredAmenities: string[];
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    id: string;
    name: string;
  };
  comments: any[];
  createdAt: string;
}

export const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const mockRequests: Request[] = [
    {
      id: '1',
      title: 'Recherche appartement 2 pièces à Cotonou',
      description: 'Je recherche un appartement de 2 pièces dans le quartier de Fidjrossè ou environs. Proche des transports en commun.',
      location: 'Cotonou, Fidjrossè',
      maxBudget: 150000,
      bedrooms: 2,
      bathrooms: 1,
      minArea: 50,
      desiredAmenities: ['WiFi', 'Parking'],
      status: 'active',
      user: { id: '1', firstName: 'Marie', lastName: 'Adjovi' },
      category: { id: '1', name: 'Appartement' },
      comments: [{}, {}],
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Villa avec jardin à Porto-Novo',
      description: 'Famille avec enfants recherche une villa avec jardin, 3 chambres minimum. Quartier calme et sécurisé.',
      location: 'Porto-Novo',
      maxBudget: 300000,
      bedrooms: 3,
      bathrooms: 2,
      minArea: 120,
      desiredAmenities: ['Jardin', 'Sécurité', 'Parking'],
      status: 'active',
      user: { id: '2', firstName: 'Jean', lastName: 'Koffi' },
      category: { id: '2', name: 'Villa' },
      comments: [{}],
      createdAt: '2024-01-14T15:20:00Z'
    }
  ];

  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header iOS Style */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Demandes</h1>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>
          
          {/* Search Bar iOS Style */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher une demande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {request.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getTimeAgo(request.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {request.category.name}
                      </span>
                      {request.maxBudget && (
                        <span className="text-lg font-bold text-green-600">
                          {request.maxBudget.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {request.description}
                  </p>

                  {/* Details */}
                  {(request.bedrooms || request.bathrooms || request.minArea) && (
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      {request.bedrooms && (
                        <span className="bg-gray-100 px-3 py-1 rounded-lg">
                          {request.bedrooms} ch.
                        </span>
                      )}
                      {request.bathrooms && (
                        <span className="bg-gray-100 px-3 py-1 rounded-lg">
                          {request.bathrooms} sdb
                        </span>
                      )}
                      {request.minArea && (
                        <span className="bg-gray-100 px-3 py-1 rounded-lg">
                          {request.minArea}m² min
                        </span>
                      )}
                    </div>
                  )}

                  {/* Amenities */}
                  {request.desiredAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {request.desiredAmenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                          {amenity}
                        </span>
                      ))}
                      {request.desiredAmenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                          +{request.desiredAmenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {request.user.firstName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.user.firstName} {request.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Demandeur</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-500">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{request.comments.length}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
                      >
                        Répondre
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune demande trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Soyez le premier à publier une demande de location
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer une demande
            </Button>
          </div>
        )}
      </div>

      {/* Modal de création */}
      <CreateRequestModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Recharger les demandes
          setRequests([...mockRequests]);
        }}
      />
    </div>
  );
};