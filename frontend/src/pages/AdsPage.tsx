import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, Users, Bed, Bath, Car, Wifi, Tv, AirVent, Utensils, ChevronDown, Grid, List, Heart, Star, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { AdModal } from '../components/ui/AdModal';
import { CreateAdButton } from '../components/ui/CreateAdButton';
import { InfiniteLoader } from '../components/ui/InfiniteLoader';
import { AdCardSkeletonGrid } from '../components/ui/AdCardSkeleton';
import { LocationSelector } from '../components/ui/LocationSelector';
import { PriceRangeSlider } from '../components/ui/PriceRangeSlider';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { adsService, Ad } from '../services/adsService';
import { api } from '../services/api';

interface AdWithUI extends Ad {
  isLiked: boolean;
  averageRating?: number;
  reviewsCount?: number;
}



const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  ac: AirVent,
  kitchen: Utensils,
  parking: Car
};

export const AdsPage: React.FC = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState<AdWithUI[]>([]);
  const [filteredAds, setFilteredAds] = useState<AdWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdWithUI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalAds, setTotalAds] = useState(0);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number; radius: number; isCity?: boolean} | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [filters, setFilters] = useState({
    location: '',
    categoryId: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[]
  });

  const locations = ['Cotonou', 'Calavi', 'Abomey-Calavi', 'Porto-Novo', 'Parakou'];
  const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
  const amenitiesList = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'tv', label: 'Télévision' },
    { value: 'ac', label: 'Climatisation' },
    { value: 'kitchen', label: 'Cuisine équipée' },
    { value: 'parking', label: 'Parking' }
  ];

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.map(cat => ({ value: cat.id, label: cat.name })));
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  }, []);

  const fetchAds = useCallback(async (page: number = 1, reset: boolean = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      
      const response = await adsService.getAds(page, 10, userLocation || undefined);
      const adsArray = response.ads || [];
      
      // Récupérer les ratings pour chaque annonce
      const adsWithRatings = await Promise.all(
        adsArray.map(async (ad) => {
          try {
            const ratingResponse = await api.get(`/reviews/ad/${ad.id}/rating`);
            return {
              ...ad,
              isLiked: false,
              averageRating: ratingResponse.data.averageRating,
              reviewsCount: ratingResponse.data.totalReviews
            };
          } catch (error) {
            return {
              ...ad,
              isLiked: false,
              averageRating: 0,
              reviewsCount: 0
            };
          }
        })
      );
      
      const adsWithUI = adsWithRatings;
      
      if (reset || page === 1) {
        setAds(adsWithUI);
        setCurrentPage(1);
      } else {
        setAds(prev => [...prev, ...adsWithUI]);
      }
      
      setTotalAds(response.pagination.total);
      setHasMore(page < response.pagination.pages);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userLocation]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAds(nextPage, false);
    }
  }, [currentPage, hasMore, loadingMore, fetchAds]);

  useInfiniteScroll(loadMore, hasMore, loadingMore);

  useEffect(() => {
    fetchCategories();
    fetchAds(1, true);
  }, [fetchCategories, fetchAds]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             ad.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPrice = ad.price >= priceRange[0] && ad.price <= priceRange[1];
        
        const matchesLocation = !filters.location || ad.location.toLowerCase().includes(filters.location.toLowerCase());
        
        const matchesCategory = !filters.categoryId || ad.category.id === filters.categoryId;
        
        const matchesBedrooms = !filters.bedrooms || ad.bedrooms >= parseInt(filters.bedrooms);
        
        const matchesBathrooms = !filters.bathrooms || ad.bathrooms >= parseInt(filters.bathrooms);
        
        const matchesAmenities = filters.amenities.length === 0 || 
                                filters.amenities.every(amenity => ad.amenities.includes(amenity));

        return matchesSearch && matchesPrice && matchesLocation && matchesCategory && 
               matchesBedrooms && matchesBathrooms && matchesAmenities;
      });

      setFilteredAds(filtered);
    };

    applyFilters();
  }, [ads, searchTerm, filters, priceRange]);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleLike = (adId: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === adId ? { ...ad, isLiked: !ad.isLiked } : ad
    ));
  };

  const openModal = (ad: AdWithUI) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const hasActiveFilters = () => {
    return (priceRange[0] > 0 || priceRange[1] < 500000) || filters.location || filters.categoryId || 
           filters.bedrooms || filters.bathrooms || filters.amenities.length > 0 || 
           searchTerm || userLocation;
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      categoryId: '',
      bedrooms: '',
      bathrooms: '',
      amenities: []
    });
    setPriceRange([0, 500000]);
    setSearchTerm('');
    setUserLocation(null);
    // Recharger les données depuis le début
    setCurrentPage(1);
    setHasMore(true);
    fetchAds(1, true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec recherche */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LocationSelector
                onLocationChange={setUserLocation}
                currentLocation={userLocation}
              />
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar des filtres */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Overlay pour mobile */}
            {showFilters && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
            )}
            
            <Card className={`sticky top-6 ${showFilters ? 'fixed inset-x-4 top-20 z-50 lg:relative lg:inset-auto lg:top-6 lg:z-auto animate-in slide-in-from-bottom-4 duration-300' : ''} lg:animate-none`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters() && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex mt-5 items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 hover:shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                        Effacer tout
                      </button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="lg:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Prix (FCFA)</label>
                    <PriceRangeSlider
                      min={0}
                      max={500000}
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                  </div>

                  {/* Localisation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Localisation</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Toutes les villes</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Catégorie</label>
                    <select
                      value={filters.categoryId}
                      onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Chambres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Chambres minimum</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Peu importe</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  {/* Salles de bain */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Salles de bain minimum</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Peu importe</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>

                  {/* Équipements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Équipements</label>
                    <div className="space-y-2">
                      {amenitiesList.map(amenity => (
                        <label key={amenity.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity.value)}
                            onChange={() => toggleAmenity(amenity.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des annonces */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-gray-600">
                  {filteredAds.length} sur {totalAds} annonce{totalAds > 1 ? 's' : ''}
                </p>
                {userLocation && (
                  <p className="text-sm text-blue-600">
                    📍 {userLocation.isCity 
                      ? 'Résultats pour la ville sélectionnée' 
                      : `Résultats dans un rayon de ${userLocation.radius} km`
                    }
                  </p>
                )}
              </div>
              <CreateAdButton onSuccess={() => window.location.reload()} />
            </div>

            {loading ? (
              <AdCardSkeletonGrid count={6} />
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6' 
                  : 'space-y-4 sm:space-y-6'
                }>
                  {filteredAds.map((ad, index) => (
                <Card 
                  key={ad.id} 
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-100 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Section */}
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
                    
                    {/* Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(ad.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Heart className={`h-4 w-4 ${ad.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-400'}`} />
                    </button>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="text-xs font-medium text-gray-700">{ad.category.name}</span>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg">
                      <span className="text-sm font-semibold">{parseInt(ad.price).toLocaleString()} FCFA</span>
                      <span className="text-xs opacity-90">/mois</span>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-1">
                      {ad.title}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">{ad.location}</span>
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex items-center gap-4 mb-3">
                      {ad.bedrooms > 0 && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Bed className="h-4 w-4" />
                          <span className="text-sm">{ad.bedrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-600">
                        <Bath className="h-4 w-4" />
                        <span className="text-sm">{ad.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <span className="text-sm">{ad.area}m²</span>
                      </div>
                      {ad.averageRating && ad.averageRating > 0 && (
                        <div className="flex items-center gap-1 text-gray-600 ml-auto">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{ad.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Amenities */}
                    <div className="flex items-center gap-1 mb-4">
                      {ad.amenities.slice(0, 3).map(amenity => {
                        const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                        return Icon ? (
                          <div key={amenity} className="w-7 h-7 bg-gray-50 rounded-md flex items-center justify-center">
                            <Icon className="h-3.5 w-3.5 text-gray-600" />
                          </div>
                        ) : null;
                      })}
                      {ad.amenities.length > 3 && (
                        <div className="w-7 h-7 bg-gray-50 rounded-md flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">+{ad.amenities.length - 3}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/${ad.user.id}`);
                        }}
                      >
                        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{ad.user.firstName[0]}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[100px] hover:text-blue-600 transition-colors">
                            {ad.user.firstName}
                          </span>
                          <span className="text-xs text-gray-500">Propriétaire</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(ad);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-medium rounded-lg transition-colors duration-200"
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </Card>
                  ))}
                </div>
                
                <InfiniteLoader 
                  loading={loadingMore} 
                  hasMore={hasMore && filteredAds.length === ads.length}
                />
              </>
            )}

            {filteredAds.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {userLocation ? 'Aucune annonce proche de vous' : 'Aucune annonce trouvée'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {userLocation 
                    ? 'Élargissez le rayon ou changez de localisation' 
                    : 'Essayez de modifier vos critères de recherche'
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {userLocation && (
                    <Button 
                      variant="outline" 
                      onClick={() => setUserLocation(null)}
                    >
                      Supprimer filtre localisation
                    </Button>
                  )}
                  <Button onClick={clearFilters}>Effacer tous les filtres</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <AdModal 
        ad={selectedAd}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};