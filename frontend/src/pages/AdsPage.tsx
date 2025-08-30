import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Bed, Bath, Car, Wifi, Tv, AirVent, Utensils, ChevronDown, Grid, List, Heart, Star, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { AdModal } from '../components/ui/AdModal';
import { adsService, Ad } from '../services/adsService';

interface AdWithUI extends Ad {
  isLiked: boolean;
  rating: number;
  reviews: number;
}



const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  ac: AirVent,
  kitchen: Utensils,
  parking: Car
};

export const AdsPage: React.FC = () => {
  const [ads, setAds] = useState<AdWithUI[]>([]);
  const [filteredAds, setFilteredAds] = useState<AdWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AdWithUI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    location: '',
    type: '',
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

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        console.log('Début du chargement des annonces...');
        const response = await adsService.getAds();
        console.log('Données reçues:', response);
        
        // Extraire le tableau ads de la réponse
        const adsArray = response.ads || [];
        console.log('Nombre d\'annonces:', adsArray.length);
        console.log('Premier élément:', adsArray[0]);
        
        const adsWithUI = adsArray.map(ad => ({
          ...ad,
          isLiked: false,
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 30) + 5
        }));
        
        console.log('Annonces avec UI:', adsWithUI);
        setAds(adsWithUI);
        setFilteredAds(adsWithUI);
        
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(adsArray.map(ad => ad.category.name))];
        setCategories(uniqueCategories.map(cat => ({ value: cat.toLowerCase(), label: cat })));
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAds();
  }, []);

  useEffect(() => {
    let filtered = ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = (!filters.priceMin || ad.price >= parseInt(filters.priceMin)) &&
                          (!filters.priceMax || ad.price <= parseInt(filters.priceMax));
      
      const matchesLocation = !filters.location || ad.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || ad.category.name.toLowerCase() === filters.type;
      
      const matchesBedrooms = !filters.bedrooms || ad.bedrooms >= parseInt(filters.bedrooms);
      
      const matchesBathrooms = !filters.bathrooms || ad.bathrooms >= parseInt(filters.bathrooms);
      
      const matchesAmenities = filters.amenities.length === 0 || 
                              filters.amenities.every(amenity => ad.amenities.includes(amenity));

      return matchesSearch && matchesPrice && matchesLocation && matchesType && 
             matchesBedrooms && matchesBathrooms && matchesAmenities;
    });

    setFilteredAds(filtered);
  }, [ads, searchTerm, filters]);

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

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      location: '',
      type: '',
      bedrooms: '',
      bathrooms: '',
      amenities: []
    });
    setSearchTerm('');
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
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Effacer tout
                    </Button>
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
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      />
                    </div>
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

                  {/* Type de propriété */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Type de propriété</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les types</option>
                      {categories.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
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
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredAds.length} annonce{filteredAds.length > 1 ? 's' : ''} trouvée{filteredAds.length > 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
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
                      src={ad.photos[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'}
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
                      <div className="flex items-center gap-1 text-gray-600 ml-auto">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{ad.rating.toFixed(1)}</span>
                      </div>
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
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{ad.user.firstName[0]}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                            {ad.user.firstName}
                          </span>
                          <span className="text-xs text-gray-500">Propriétaire</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => openModal(ad)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-medium rounded-lg transition-colors duration-200"
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </Card>
                ))}
              </div>
            )}

            {filteredAds.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
                <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
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