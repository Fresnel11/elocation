import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Wifi, Tv, AirVent, Utensils, Car, Star, Phone, MessageCircle, Send, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from './Button';

interface AdModalProps {
  ad: {
    id: string;
    title: string;
    description: string;
    price: string;
    location: string;
    photos: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
    amenities: string[];
    category: { name: string };
    user: { firstName: string; lastName: string };
    rating: number;
    reviews: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  ac: AirVent,
  kitchen: Utensils,
  parking: Car
};

const amenityLabels = {
  wifi: 'WiFi',
  tv: 'Télévision',
  ac: 'Climatisation',
  kitchen: 'Cuisine équipée',
  parking: 'Parking',
  security: 'Sécurité',
  garden: 'Jardin',
  pool: 'Piscine'
};

export const AdModal: React.FC<AdModalProps> = ({ ad, isOpen, onClose }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews] = useState([
    {
      id: '1',
      user: { firstName: 'Marie', lastName: 'D.' },
      rating: 5,
      comment: 'Excellent logement, très propre et bien situé. Le propriétaire est très réactif.',
      date: '2024-01-15',
      helpful: 12
    },
    {
      id: '2', 
      user: { firstName: 'Jean', lastName: 'K.' },
      rating: 4,
      comment: 'Bon rapport qualité-prix. Quelques petits détails à améliorer mais dans l\'ensemble très satisfait.',
      date: '2024-01-10',
      helpful: 8
    },
    {
      id: '3',
      user: { firstName: 'Fatou', lastName: 'S.' },
      rating: 5,
      comment: 'Parfait pour un séjour en famille. Toutes les commodités sont présentes.',
      date: '2024-01-05',
      helpful: 15
    }
  ]);

  if (!isOpen || !ad) return null;

  const photos = ad.photos.length > 0 ? ad.photos : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium text-sm transition-colors duration-200 border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Détails
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-medium text-sm transition-colors duration-200 border-b-2 flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Avis ({reviews.length})
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Photo Section */}
          <div className="relative lg:w-1/2 h-64 lg:h-auto">
            <img
              src={photos[currentPhotoIndex]}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{ad.category.name}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            {activeTab === 'details' ? (
            <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 pr-4">{ad.title}</h2>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{ad.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{ad.location}</span>
              </div>
              
              <div className="bg-blue-50 px-4 py-3 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">
                  {parseInt(ad.price).toLocaleString()} FCFA
                </div>
                <div className="text-sm text-blue-600/70">par mois</div>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {ad.bedrooms > 0 && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                  <div className="text-lg font-semibold text-gray-900">{ad.bedrooms}</div>
                  <div className="text-xs text-gray-600">Chambres</div>
                </div>
              )}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Bath className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                <div className="text-lg font-semibold text-gray-900">{ad.bathrooms}</div>
                <div className="text-xs text-gray-600">Salles de bain</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 mb-1">{ad.area}m²</div>
                <div className="text-xs text-gray-600">Surface</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{ad.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Équipements</h3>
              <div className="grid grid-cols-2 gap-3">
                {ad.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                  const label = amenityLabels[amenity as keyof typeof amenityLabels] || amenity;
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      {Icon ? (
                        <Icon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Owner Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Propriétaire</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{ad.user.firstName[0]}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{ad.user.firstName} {ad.user.lastName}</div>
                  <div className="text-sm text-gray-600">Propriétaire vérifié</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
            </>
            ) : (
            /* Reviews Section */
            <div className="h-full flex flex-col">
              {/* Reviews Header */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold text-gray-900">{ad.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(ad.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{reviews.length} avis</div>
                  </div>
                </div>
              </div>

              {/* Add Review Form */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Laisser un avis</h3>
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="transition-colors duration-200"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Partagez votre expérience..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{review.user.firstName[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{review.user.firstName} {review.user.lastName}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
                        <ThumbsUp className="h-4 w-4" />
                        Utile ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};