import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Bed, Bath, Car, Wifi, Tv, AirVent, Utensils, ChevronDown, Grid, List, Heart, Star, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'apartment' | 'house' | 'studio' | 'villa';
  amenities: string[];
  rating: number;
  reviews: number;
  isLiked: boolean;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Appartement moderne 2 chambres - Cotonou Centre',
    description: 'Magnifique appartement entièrement meublé avec vue sur la ville',
    price: 85000,
    location: 'Cotonou, Littoral',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    type: 'apartment',
    amenities: ['wifi', 'tv', 'ac', 'kitchen'],
    rating: 4.8,
    reviews: 24,
    isLiked: false,
    owner: {
      name: 'Marie Adjovi',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: '2',
    title: 'Villa spacieuse 4 chambres avec jardin',
    description: 'Belle villa familiale dans un quartier calme et sécurisé',
    price: 150000,
    location: 'Calavi, Atlantique',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    bedrooms: 4,
    bathrooms: 3,
    area: 120,
    type: 'villa',
    amenities: ['wifi', 'tv', 'ac', 'kitchen', 'parking'],
    rating: 4.9,
    reviews: 18,
    isLiked: true,
    owner: {
      name: 'Jean Koudjo',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: '3',
    title: 'Studio moderne proche université',
    description: 'Studio parfait pour étudiant, entièrement équipé',
    price: 45000,
    location: 'Abomey-Calavi, Atlantique',
    images: ['/api/placeholder/400/300'],
    bedrooms: 1,
    bathrooms: 1,
    area: 25,
    type: 'studio',
    amenities: ['wifi', 'tv', 'kitchen'],
    rating: 4.5,
    reviews: 12,
    isLiked: false,
    owner: {
      name: 'Fatou Sanni',
      avatar: '/api/placeholder/40/40',
      verified: false
    }
  }
];

const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  ac: AirVent,
  kitchen: Utensils,
  parking: Car
};

export const AdsPage: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>(mockAds);
  const [filteredAds, setFilteredAds] = useState<Ad[]>(mockAds);
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
  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'studio', label: 'Studio' },
    { value: 'villa', label: 'Villa' }
  ];
  const amenitiesList = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'tv', label: 'Télévision' },
    { value: 'ac', label: 'Climatisation' },
    { value: 'kitchen', label: 'Cuisine équipée' },
    { value: 'parking', label: 'Parking' }
  ];

  useEffect(() => {
    let filtered = ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = (!filters.priceMin || ad.price >= parseInt(filters.priceMin)) &&
                          (!filters.priceMax || ad.price <= parseInt(filters.priceMax));
      
      const matchesLocation = !filters.location || ad.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || ad.type === filters.type;
      
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
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
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
                      {propertyTypes.map(type => (
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

            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6' 
              : 'space-y-4 sm:space-y-6'
            }>
              {filteredAds.map((ad, index) => (
                <Card 
                  key={ad.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(ad.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm"
                    >
                      <Heart className={`h-4 w-4 transition-all duration-200 ${ad.isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 hover:text-red-400'}`} />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg backdrop-blur-sm">
                      {ad.price.toLocaleString()} FCFA/mois
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{ad.title}</h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{ad.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{ad.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{ad.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{ad.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{ad.area}m²</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {ad.amenities.slice(0, 4).map(amenity => {
                        const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                        return Icon ? (
                          <div key={amenity} className="p-1.5 bg-gray-100 rounded">
                            <Icon className="h-3 w-3 text-gray-600" />
                          </div>
                        ) : null;
                      })}
                      {ad.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">+{ad.amenities.length - 4}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={ad.owner.avatar}
                          alt={ad.owner.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600">{ad.owner.name}</span>
                        {ad.owner.verified && (
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <Button size="sm" className="text-xs">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
    </div>
  );
};