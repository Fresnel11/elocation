import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Star, Grid, List, MessageCircle, Settings, Edit, Share2, MoreVertical, Heart, Eye } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="relative">
        {/* Background gradient */}
        <div className="h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"></div>
        
        {/* Header controls */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 pt-12">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <MoreVertical className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        
        {/* Profile Section */}
        <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-6 pt-6">
          {/* Profile Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 -mt-10 border-4 border-white shadow-lg">
              <span className="text-white text-2xl font-bold">
                {getInitials(user.firstName, user.lastName)}
              </span>
            </div>
            <div className="flex-1 pt-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Membre depuis {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-xs text-gray-500">(24 avis)</span>
                </div>
                <div className="text-sm text-gray-600">
                  {user._count?.ads || 0} annonce{(user._count?.ads || 0) > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-2"
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Action Buttons */}
          {!isOwner && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleContactUser}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Message
              </button>
              {user.whatsappNumber && (
                <button
                  onClick={handleWhatsAppContact}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  WhatsApp
                </button>
              )}
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{user._count?.ads || 0}</div>
              <div className="text-sm text-gray-600">Annonces</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Note</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-600">Avis</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('ads')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'ads'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Annonces ({userAds.length})
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Réservations
              </button>
            )}
          </div>
              
          {/* Content */}
          {activeTab === 'ads' && (
            <div>

              {adsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse"></div>
                  ))}
                </div>
              ) : userAds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Grid className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune annonce
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isOwner ? 'Vous n\'avez pas encore publié d\'annonce.' : `${user.firstName} n'a pas encore publié d'annonces.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAds.map((ad) => (
                    <div 
                      key={ad.id}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                      onClick={() => openModal(ad)}
                    >
                      <div className="flex">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={ad.photos[0] 
                              ? (ad.photos[0].startsWith('http') 
                                  ? ad.photos[0] 
                                  : `http://localhost:3000${ad.photos[0]}`
                                )
                              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
                            }
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {ad.title}
                            </h3>
                            <button className="ml-2 p-1">
                              <Heart className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <div className="flex items-center text-gray-500 mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="text-xs truncate">{ad.location}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-blue-600 font-bold text-sm">
                              {parseInt(ad.price.toString()).toLocaleString()} FCFA
                              <span className="text-xs text-gray-500 font-normal">/mois</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>24</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                                <span>4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'bookings' && isOwner && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune réservation
                </h3>
                <p className="text-gray-600 text-sm">
                  Vos réservations apparaîtront ici.
                </p>
              </div>
            </div>
          )}
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