import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Home, Bath, Bed, Wifi, Car, Tv, AirVent, Utensils, Shield } from 'lucide-react';
import { Button } from './Button';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Category {
  id: string;
  name: string;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    maxBudget: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    categoryId: '',
    desiredAmenities: [] as string[]
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const amenitiesList = [
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'parking', label: 'Parking', icon: Car },
    { value: 'tv', label: 'Télévision', icon: Tv },
    { value: 'ac', label: 'Climatisation', icon: AirVent },
    { value: 'kitchen', label: 'Cuisine équipée', icon: Utensils },
    { value: 'security', label: 'Sécurité', icon: Shield }
  ];

  const cities = [
    'Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Djougou', 
    'Bohicon', 'Kandi', 'Lokossa', 'Ouidah', 'Abomey'
  ];

  useEffect(() => {
    if (isOpen) {
      // Simuler le chargement des catégories
      setCategories([
        { id: '1', name: 'Immobilier' },
        { id: '2', name: 'Véhicules' },
        { id: '3', name: 'Électroménager' },
        { id: '4', name: 'Mobilier' },
        { id: '5', name: 'Électronique' },
        { id: '6', name: 'Outils & Équipements' }
      ]);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      desiredAmenities: prev.desiredAmenities.includes(amenity)
        ? prev.desiredAmenities.filter(a => a !== amenity)
        : [...prev.desiredAmenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Demande créée:', formData);
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        maxBudget: '',
        bedrooms: '',
        bathrooms: '',
        minArea: '',
        categoryId: '',
        desiredAmenities: []
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Nouvelle demande</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de votre demande *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Recherche appartement 2 pièces à Cotonou"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez précisément ce que vous recherchez..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Localisation et Catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville souhaitée *
                  </label>
                  <select
                    required
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une ville</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget maximum (FCFA)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={formData.maxBudget}
                    onChange={(e) => handleInputChange('maxBudget', e.target.value)}
                    placeholder="150000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Critères dynamiques selon la catégorie */}
              {formData.categoryId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Critères souhaités
                  </label>
                  
                  {/* Critères pour Immobilier */}
                  {formData.categoryId === '1' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Chambres minimum</label>
                        <select
                          value={formData.bedrooms}
                          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Peu importe</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Salles de bain minimum</label>
                        <select
                          value={formData.bathrooms}
                          onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Peu importe</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Surface minimum (m²)</label>
                        <input
                          type="number"
                          value={formData.minArea}
                          onChange={(e) => handleInputChange('minArea', e.target.value)}
                          placeholder="50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Critères pour Véhicules */}
                  {formData.categoryId === '2' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Type de véhicule</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Peu importe</option>
                          <option value="voiture">Voiture</option>
                          <option value="moto">Moto</option>
                          <option value="camion">Camion</option>
                          <option value="bus">Bus</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Année minimum</label>
                        <input
                          type="number"
                          placeholder="2015"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Critères pour Électroménager */}
                  {formData.categoryId === '3' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Type d'appareil</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Peu importe</option>
                          <option value="refrigerateur">Réfrigérateur</option>
                          <option value="lave-linge">Lave-linge</option>
                          <option value="climatiseur">Climatiseur</option>
                          <option value="cuisiniere">Cuisinière</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">État souhaité</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Peu importe</option>
                          <option value="neuf">Neuf</option>
                          <option value="tres-bon">Très bon état</option>
                          <option value="bon">Bon état</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {/* Critères pour autres catégories */}
                  {(formData.categoryId === '4' || formData.categoryId === '5' || formData.categoryId === '6') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">État souhaité</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Peu importe</option>
                          <option value="neuf">Neuf</option>
                          <option value="tres-bon">Très bon état</option>
                          <option value="bon">Bon état</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Durée souhaitée</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Peu importe</option>
                          <option value="1-jour">1 jour</option>
                          <option value="1-semaine">1 semaine</option>
                          <option value="1-mois">1 mois</option>
                          <option value="long-terme">Long terme</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Équipements/Options souhaités selon la catégorie */}
              {formData.categoryId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {formData.categoryId === '1' ? 'Équipements souhaités' : 
                     formData.categoryId === '2' ? 'Options véhicule' :
                     'Options souhaitées'}
                  </label>
                  
                  {/* Équipements pour Immobilier */}
                  {formData.categoryId === '1' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map(amenity => {
                        const Icon = amenity.icon;
                        const isSelected = formData.desiredAmenities.includes(amenity.value);
                        return (
                          <button
                            key={amenity.value}
                            type="button"
                            onClick={() => toggleAmenity(amenity.value)}
                            className={`flex items-center gap-2 p-3 border rounded-xl transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{amenity.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Options pour Véhicules */}
                  {formData.categoryId === '2' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['GPS', 'Climatisation', 'Bluetooth', 'Sièges cuir', 'Boîte auto', 'Caméra recul'].map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleAmenity(option)}
                          className={`flex items-center gap-2 p-3 border rounded-xl transition-all ${
                            formData.desiredAmenities.includes(option)
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Options pour autres catégories */}
                  {(formData.categoryId === '3' || formData.categoryId === '4' || formData.categoryId === '5' || formData.categoryId === '6') && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Livraison incluse', 'Installation', 'Manuel inclus', 'Garantie', 'Accessoires', 'Support technique'].map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleAmenity(option)}
                          className={`flex items-center gap-2 p-3 border rounded-xl transition-all ${
                            formData.desiredAmenities.includes(option)
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Publication...' : 'Publier la demande'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};