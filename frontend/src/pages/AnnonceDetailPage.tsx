// elocation/frontend/src/pages/AnnonceDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adsService, Ad } from '../services/adsService';
import { api } from '../services/api';
import { ArrowLeft, Heart, Star, Bed, Bath, Square, MapPin, User, MessageCircle, Plus, Phone, Share2, ChevronLeft, ChevronRight, Calendar, Users as UsersIcon, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ClickableAvatar } from '../components/ui/ClickableAvatar';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  } | null;
}

const AnnonceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    message: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchAd = async () => {
        try {
          setLoading(true);
          const [adData, ratingData, reviewsData] = await Promise.all([
            adsService.getAdById(id),
            api.get(`/reviews/ad/${id}/rating`),
            api.get(`/reviews/ad/${id}`)
          ]);
          setAd(adData);
          setRating({
            averageRating: ratingData.data.averageRating || 0,
            totalReviews: ratingData.data.totalReviews || 0
          });
          setReviews(reviewsData.data || []);
          if (adData.photos && adData.photos.length > 0) {
            setSelectedImage(adData.photos[0]);
          }
        } catch (err) {
          setError('Impossible de charger les détails de l\'annonce.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAd();
    }
  }, [id]);

  // Vérifier si l'utilisateur peut ajouter un avis
  const canAddReview = () => {
    if (!user || !ad) return false;
    if (ad.user.id === user.id) return false; // Propriétaire ne peut pas évaluer
    const userReviewsCount = reviews.filter(review => review.user?.id === user.id).length;
    return userReviewsCount < 2; // Maximum 2 avis par utilisateur
  };

  const handleSubmitReview = async () => {
    if (!newReview.rating || !newReview.comment.trim()) return;
    

    
    try {
      await api.post(`/reviews`, {
        adId: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      // Refresh data
      const [ratingData, reviewsData] = await Promise.all([
        api.get(`/reviews/ad/${id}/rating`),
        api.get(`/reviews/ad/${id}`)
      ]);
      
      setRating({
        averageRating: ratingData.data.averageRating || 0,
        totalReviews: ratingData.data.totalReviews || 0
      });
      setReviews(reviewsData.data || []);
      setNewReview({ rating: 0, comment: '' });
      setShowAddReview(false);
      showToast('success', 'Avis ajouté avec succès !');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avis';
      showToast('error', errorMessage);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      showToast('error', 'Vous devez être connecté pour réserver');
      return;
    }
    
    if (!bookingData.startDate || !bookingData.endDate) {
      showToast('error', 'Veuillez sélectionner les dates');
      return;
    }
    
    try {
      setBookingLoading(true);
      await api.post('/bookings', {
        adId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        message: bookingData.message
      });
      showToast('success', 'Demande de réservation envoyée !');
      setBookingData({ startDate: '', endDate: '', guests: 1, message: '' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la réservation';
      showToast('error', errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!ad) {
    return <div className="text-center mt-10">Annonce non trouvée.</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Image principale avec overlay */}
        <div className="relative h-96">
          <img 
            src={selectedImage || ad.photos?.[0] || 'https://via.placeholder.com/600x400'} 
            alt={ad.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Header avec boutons */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </button>
          </div>
          
          {/* Miniatures des images */}
          {ad.photos && ad.photos.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex space-x-2 overflow-x-auto">
                {ad.photos.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Miniature ${index + 1}`}
                    className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 ${
                      selectedImage === image ? 'border-white' : 'border-white/30'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contenu principal mobile */}
        <div className="bg-white rounded-t-3xl -mt-12 relative z-10 px-6 pt-2 pb-24">
          {/* Titre et rating */}
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{ad.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${
                    star <= Math.round(rating.averageRating) 
                      ? 'fill-orange-400 text-orange-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {rating.averageRating > 0 ? rating.averageRating.toFixed(1) : '0.0'}
            </span>
            <span className="text-sm text-gray-500">({rating.totalReviews})</span>
          </div>
        </div>

          {/* Caractéristiques */}
          <div className="flex items-center gap-6 mb-4">
          {ad.bedrooms && ad.bedrooms > 0 && (
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">{ad.bedrooms} Bed</span>
            </div>
          )}
          {ad.bathrooms && (
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">{ad.bathrooms} Bathroom</span>
            </div>
          )}
          {ad.area && (
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">{ad.area} Sqft</span>
            </div>
          )}
        </div>

          {/* Section Details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
          <p className="text-gray-600 leading-relaxed">
            {ad.description || "The prestige of one of Polo Alto's most sought-after neighborhoods takes center stage in this magnificent home that..."}
            <span className="text-blue-600 font-medium cursor-pointer"> Read more</span>
          </p>
        </div>

          {/* Localisation */}
          <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <span className="text-gray-900 font-medium">{ad.location}</span>
          </div>
        </div>

          {/* Propriétaire */}
          <div className="flex items-center gap-3 mb-4">
          <ClickableAvatar
            avatarUrl={ad.user?.profilePicture}
            userName={`${ad.user?.firstName || 'Utilisateur'} ${ad.user?.lastName || ''}`}
            size="lg"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{ad.user?.firstName || 'Utilisateur'} {ad.user?.lastName || ''}</p>
            <p className="text-sm text-gray-500">Propriétaire</p>
          </div>
          <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </button>
        </div>

          {/* Section Avis */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Avis ({rating.totalReviews})</h3>
            {canAddReview() ? (
              <button 
                onClick={() => setShowAddReview(!showAddReview)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Ajouter un avis
              </button>
            ) : (
              <div className="text-sm text-gray-500">
                {!user ? 'Connectez-vous pour laisser un avis' : 
                 ad?.user.id === user.id ? 'Vous ne pouvez pas évaluer votre propre annonce' :
                 'Vous avez atteint la limite de 2 avis par annonce'}
              </div>
            )}
          </div>

            {/* Formulaire d'ajout d'avis */}
            {showAddReview && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= newReview.rating 
                            ? 'fill-orange-400 text-orange-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Partagez votre expérience..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={!newReview.rating || !newReview.comment.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-300"
                >
                  Publier
                </button>
                <button
                  onClick={() => {
                    setShowAddReview(false);
                    setNewReview({ rating: 0, comment: '' });
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

            {/* Liste des avis */}
            <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <ClickableAvatar
                      avatarUrl={review.user?.profilePicture}
                      userName={review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Utilisateur anonyme'}
                      size="md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          {review.user ? (
                            <Link 
                              to={`/user/${review.user.id}`}
                              className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              {review.user.firstName && review.user.lastName 
                                ? `${review.user.firstName} ${review.user.lastName}` 
                                : review.user.firstName || 'Utilisateur anonyme'
                              }
                            </Link>
                          ) : (
                            <p className="font-semibold text-gray-900 text-sm">
                              Utilisateur anonyme
                            </p>
                          )}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-3 w-3 ${
                                  star <= review.rating 
                                    ? 'fill-orange-400 text-orange-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Aucun avis pour le moment</p>
                <p className="text-xs mt-1">Soyez le premier à laisser un avis !</p>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Footer fixe avec prix et bouton */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {parseInt(ad.price.toString()).toLocaleString()} FCFA
              </p>
              <p className="text-sm text-gray-500">Par mois</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Réserver
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Design Moderne */}
      <div className="hidden lg:block bg-gray-50 min-h-screen">
        {/* Header minimaliste */}
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Retour</span>
              </button>
              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-gray-100 rounded-full transition-colors group">
                  <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </button>
                <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-12 gap-12">
            {/* Section principale - 8 colonnes */}
            <div className="col-span-8 space-y-8">
              {/* Galerie d'images moderne */}
              {ad.photos && ad.photos.length > 1 ? (
                <div className="grid grid-cols-4 gap-2 h-[600px]">
                  {/* Image principale */}
                  <div className="col-span-3 row-span-2 relative group">
                    <img 
                      src={selectedImage || ad.photos[0]} 
                      alt={ad.title} 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl" />
                    <button
                      onClick={() => {
                        const currentIndex = ad.photos.indexOf(selectedImage || ad.photos[0]);
                        const prevIndex = currentIndex === 0 ? ad.photos.length - 1 : currentIndex - 1;
                        setSelectedImage(ad.photos[prevIndex]);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => {
                        const currentIndex = ad.photos.indexOf(selectedImage || ad.photos[0]);
                        const nextIndex = currentIndex === ad.photos.length - 1 ? 0 : currentIndex + 1;
                        setSelectedImage(ad.photos[nextIndex]);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                  </div>
                  
                  {/* Miniatures */}
                  <div className="col-span-1 space-y-2">
                    {ad.photos.slice(1, 5).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`w-full h-[147px] rounded-xl overflow-hidden transition-all hover:scale-105 ${
                          selectedImage === image ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Photo ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[600px]">
                  <img 
                    src={ad.photos?.[0] || 'https://via.placeholder.com/600x400'} 
                    alt={ad.title} 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              )}

              {/* Informations principales */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">{ad.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <span className="text-lg">{ad.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${
                              star <= Math.round(rating.averageRating) 
                                ? 'fill-orange-400 text-orange-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {rating.averageRating > 0 ? rating.averageRating.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-gray-500">({rating.totalReviews} avis)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900">
                      {parseInt(ad.price.toString()).toLocaleString()}
                    </div>
                    <div className="text-gray-600">FCFA / mois</div>
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="flex items-center gap-8 py-6 border-y border-gray-200">
                  {ad.bedrooms && ad.bedrooms > 0 && (
                    <div className="flex items-center gap-3">
                      <Bed className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">{ad.bedrooms} Chambres</span>
                    </div>
                  )}
                  {ad.bathrooms && (
                    <div className="flex items-center gap-3">
                      <Bath className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">{ad.bathrooms} Salles de bain</span>
                    </div>
                  )}
                  {ad.area && (
                    <div className="flex items-center gap-3">
                      <Square className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">{ad.area} m²</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {ad.description}
                  </p>
                  
                  {/* Informations hôte */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hébergé par</h3>
                    <div className="flex items-center gap-4">
                      <ClickableAvatar
                        avatarUrl={ad.user?.profilePicture}
                        userName={`${ad.user?.firstName || 'Utilisateur'} ${ad.user?.lastName || ''}`}
                        size="lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {ad.user?.firstName || 'Utilisateur'} {ad.user?.lastName || ''}
                        </h4>
                        <p className="text-gray-600 text-sm">Hôte depuis 2020</p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Contacter
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avis */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Avis des voyageurs</h2>
                  {canAddReview() && (
                    <button 
                      onClick={() => setShowAddReview(!showAddReview)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Ajouter un avis
                    </button>
                  )}
                </div>
                
                {/* Formulaire d'ajout d'avis */}
                {showAddReview && (
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`h-8 w-8 ${
                                star <= newReview.rating 
                                  ? 'fill-orange-400 text-orange-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Partagez votre expérience..."
                        className="w-full p-4 border border-gray-300 rounded-xl resize-none h-32 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitReview}
                        disabled={!newReview.rating || !newReview.comment.trim()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
                      >
                        Publier l'avis
                      </button>
                      <button
                        onClick={() => {
                          setShowAddReview(false);
                          setNewReview({ rating: 0, comment: '' });
                        }}
                        className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Liste des avis */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <ClickableAvatar
                            avatarUrl={review.user?.profilePicture}
                            userName={review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Utilisateur anonyme'}
                            size="lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Utilisateur anonyme'}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${
                                    star <= review.rating 
                                      ? 'fill-orange-400 text-orange-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg">Aucun avis pour le moment</p>
                      <p className="text-sm mt-2">Soyez le premier à partager votre expérience !</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Réservation - 4 colonnes */}
            <div className="col-span-4">
              <div className="bg-white rounded-3xl p-8 shadow-xl sticky top-24">
                <div className="mb-8">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {parseInt(ad.price.toString()).toLocaleString()} FCFA
                  </div>
                  <div className="text-gray-600">par mois</div>
                </div>

                {/* Formulaire de réservation */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Arrivée
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Départ
                      </label>
                      <input
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UsersIcon className="h-4 w-4 inline mr-1" />
                      Nombre d'invités
                    </label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} invité{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      value={bookingData.message}
                      onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Présentez-vous au propriétaire..."
                      className="w-full p-3 border border-gray-300 rounded-xl resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button 
                    onClick={handleBooking}
                    disabled={bookingLoading || !bookingData.startDate || !bookingData.endDate}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {bookingLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Demander une réservation
                      </>
                    )}
                  </button>
                  
                  <div className="text-center text-sm text-gray-500">
                    Vous ne serez pas débité pour le moment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AnnonceDetailPage;