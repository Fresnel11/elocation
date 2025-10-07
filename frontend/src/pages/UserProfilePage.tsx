import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Star, Grid, List, MessageCircle, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { AdCardSkeletonGrid } from '../components/ui/AdCardSkeleton';
import { AdModal } from '../components/ui/AdModal';
import { MessageModal } from '../components/ui/MessageModal';
import { ProfileCard } from '../components/ui/ProfileCard';
import { EditProfileModal } from '../components/ui/EditProfileModal';
import { BookingHistory } from '../components/ui/BookingHistory';
import { UserReputation } from '../components/ui/UserReputation';
import { ReportModal } from '../components/ui/ReportModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ads' | 'bookings'>('ads');
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

  const handleProfileUpdated = () => {
    fetchUserProfile();
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

  const isOwner = currentUser?.id === userId;

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
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Retour</span>
            </button>
            {isOwner && (
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Modifier le profil
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil utilisateur */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard
              user={user}
              isOwner={isOwner}
              onEditProfile={() => setIsEditModalOpen(true)}
            />
            
            {!isOwner && (
              <Card>
                <CardContent className="p-4 space-y-3">
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
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setIsReportModalOpen(true)}
                  >
                    Signaler le profil
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Onglets */}
            <Card className="mb-6">
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('ads')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'ads'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Annonces ({userAds.length})
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'bookings'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Mes réservations
                    </button>
                  )}
                </nav>
              </div>
              
              <CardContent className="p-6">
                {activeTab === 'ads' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {isOwner ? 'Mes annonces' : `Annonces de ${user.firstName}`}
                        </h2>
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
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Grid className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucune annonce
                        </h3>
                        <p className="text-gray-600">
                          {isOwner ? 'Vous n\'avez pas encore publié d\'annonce.' : `${user.firstName} n'a pas encore publié d'annonces.`}
                        </p>
                      </div>
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
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => openModal(ad)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                                  >
                                    Voir détails
                                  </Button>
                                  {!isOwner && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsReportModalOpen(true);
                                      }}
                                      className="px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      Signaler
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'bookings' && isOwner && (
                  <BookingHistory userId={userId!} />
                )}
              </CardContent>
            </Card>
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
      
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={user.profile || {}}
        onProfileUpdated={handleProfileUpdated}
      />
      
      {!isOwner && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          type="user"
          targetId={user.id}
          targetTitle={`${user.firstName} ${user.lastName}`}
        />
      )}
    </div>
  );
};