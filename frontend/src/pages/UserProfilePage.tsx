import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Star, Grid, List, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { AdCardSkeletonGrid } from '../components/ui/AdCardSkeleton';
import { AdModal } from '../components/ui/AdModal';
import { MessageModal } from '../components/ui/MessageModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  createdAt: string;
  _count?: {
    ads: number;
  };
}

interface UserAd {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  photos: string[];
  video?: string;
  category: {
    id: string;
    name: string;
  };
  subCategory?: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  whatsappNumber?: string;
  isAvailable?: boolean;
  isActive?: boolean;
  // Propriétés UI ajoutées pour compatibilité avec AdModal
  isLiked?: boolean;
  rating?: number;
  reviews?: number;
}

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userAds, setUserAds] = useState<UserAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [adsLoading, setAdsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAd, setSelectedAd] = useState<UserAd | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserAds();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAds = async () => {
    try {
      const response = await api.get(`/ads/user/${userId}`);
      setUserAds(response.data.ads || []);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setAdsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const openModal = (ad: UserAd) => {
    // Ajouter les propriétés manquantes pour AdModal
    const adWithUIProps = {
      ...ad,
      isLiked: false,
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 30) + 5,
      amenities: ad.amenities || [],
      description: ad.description || '',
      video: ad.video || undefined
    };
    setSelectedAd(adWithUIProps);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const handleContactUser = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsMessageModalOpen(true);
  };

  const handleWhatsAppContact = () => {
    if (user?.whatsappNumber) {
      const message = encodeURIComponent(`Bonjour ${user.firstName}, je vous contacte via eLocation Bénin.`);
      window.open(`https://wa.me/${user.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur introuvable</h2>
          <p className="text-gray-600 mb-4">Ce profil n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/ads')}>Retour aux annonces</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil utilisateur */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                {/* Avatar et nom */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">Propriétaire</p>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userAds.length}</div>
                    <div className="text-sm text-gray-600">Annonces</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold text-gray-900">4.8</span>
                    </div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                </div>

                {/* Informations */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>Membre depuis {formatDate(user.createdAt)}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="h-5 w-5" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="h-5 w-5" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {currentUser?.id !== user.id && (
                    <>
                      <Button 
                        onClick={handleContactUser}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                      {user.whatsappNumber && (
                        <Button 
                          onClick={handleWhatsAppContact}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                    </>
                  )}
                  <Button variant="outline" className="w-full">
                    Signaler le profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Annonces de l'utilisateur */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Annonces de {user.firstName}
                </h2>
                <p className="text-gray-600 mt-1">
                  {userAds.length} annonce{userAds.length > 1 ? 's' : ''} publiée{userAds.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {adsLoading ? (
              <AdCardSkeletonGrid count={6} />
            ) : userAds.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Grid className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune annonce
                  </h3>
                  <p className="text-gray-600">
                    {user.firstName} n'a pas encore publié d'annonces.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' 
                : 'space-y-6'
              }>
                {userAds.map((ad) => (
                  <Card 
                    key={ad.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={ad.photos[0] 
                          ? (ad.photos[0].startsWith('http') 
                              ? ad.photos[0] 
                              : `http://localhost:3000${ad.photos[0]}`
                            )
                          : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
                        }
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
                        <span className="text-xs font-medium text-gray-700">{ad.category.name}</span>
                      </div>
                      
                      <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg">
                        <span className="text-sm font-semibold">{parseInt(ad.price.toString()).toLocaleString()} FCFA</span>
                        <span className="text-xs opacity-90">/mois</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-1">
                        {ad.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{ad.location}</span>
                      </div>
                      
                      {(ad.bedrooms || ad.bathrooms || ad.area) && (
                        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                          {ad.bedrooms && <span>{ad.bedrooms} ch.</span>}
                          {ad.bathrooms && <span>{ad.bathrooms} sdb.</span>}
                          {ad.area && <span>{ad.area}m²</span>}
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-gray-100">
                        <Button 
                          size="sm" 
                          onClick={() => openModal(ad)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <AdModal 
        ad={selectedAd}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      
      {user && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          adId="" // Pas d'annonce spécifique pour un contact direct
          adTitle={`Contact avec ${user.firstName} ${user.lastName}`}
          otherUserId={user.id}
          otherUserName={`${user.firstName} ${user.lastName}`}
        />
      )}
    </div>
  );
};