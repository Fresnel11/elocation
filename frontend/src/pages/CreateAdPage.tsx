import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Upload, Image, Video, Trash2, Camera } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export const CreateAdPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    categoryId: '',
    subCategoryId: '',
    amenities: [] as string[],
    whatsappNumber: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<{photos: string[], video?: string}>({photos: []});
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const amenitiesList = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'tv', label: 'Télévision' },
    { value: 'ac', label: 'Climatisation' },
    { value: 'kitchen', label: 'Cuisine équipée' },
    { value: 'parking', label: 'Parking' },
    { value: 'security', label: 'Sécurité' },
    { value: 'garden', label: 'Jardin' },
    { value: 'pool', label: 'Piscine' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await api.get(`/subcategories?categoryId=${categoryId}`);
      setSubCategories(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des sous-catégories:', err);
      setSubCategories([]);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Si on change de catégorie, charger les sous-catégories
    if (field === 'categoryId') {
      setFormData(prev => ({ ...prev, subCategoryId: '' })); // Reset sous-catégorie
      if (value) {
        fetchSubCategories(value);
      } else {
        setSubCategories([]);
      }
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateAndSetFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > 5) {
      error('Erreur', 'Maximum 5 fichiers autorisés');
      return false;
    }
    
    const videoFiles = selectedFiles.filter(f => f.type.startsWith('video/'));
    const photoFiles = selectedFiles.filter(f => f.type.startsWith('image/'));
    
    if (videoFiles.length > 1) {
      error('Erreur', 'Une seule vidéo autorisée');
      return false;
    }
    
    if (videoFiles.length === 1 && photoFiles.length > 4) {
      error('Erreur', 'Maximum 4 photos avec une vidéo');
      return false;
    }
    
    for (const file of selectedFiles) {
      const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) {
        error('Erreur', `Fichier trop volumineux: ${file.name}. Taille max: ${file.type.startsWith('video/') ? '10MB' : '2MB'}`);
        return false;
      }
    }
    
    setFiles(selectedFiles);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    validateAndSetFiles(selectedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 1,
        area: parseInt(formData.area) || 0,
        subCategoryId: formData.subCategoryId || undefined,
        photos: uploadedMedia.photos,
        video: uploadedMedia.video
      };

      // Upload des fichiers d'abord
      if (files.length > 0) {
        const formDataFiles = new FormData();
        files.forEach(file => formDataFiles.append('files', file));
        
        const uploadResponse = await api.post('/upload/files', formDataFiles, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        adData.photos = uploadResponse.data.photos || [];
        adData.video = uploadResponse.data.video;
      }
      
      await api.post('/ads', adData);
      success('Annonce publiée !', 'Votre annonce a été publiée avec succès.');
      navigate('/ads');
    } catch (err: any) {
      error('Erreur', err.response?.data?.message || 'Une erreur est survenue lors de la publication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Publier une annonce</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <Input
            label="Titre de l'annonce"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            placeholder="Ex: Appartement moderne 2 chambres"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Décrivez votre bien en détail..."
            />
          </div>

          {/* Prix */}
          <Input
            label="Prix (FCFA/mois)"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
            placeholder="85000"
          />

          {/* Localisation */}
          <Input
            label="Localisation"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
            placeholder="Cotonou, Littoral"
          />

          {/* Catégorie */}
          <Select
            label="Catégorie"
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            required
          />

          {/* Sous-catégorie */}
          <Select
            label="Sous-catégorie"
            options={subCategories.map(subCat => ({ value: subCat.id, label: subCat.name }))}
            value={formData.subCategoryId}
            onChange={(e) => handleChange('subCategoryId', e.target.value)}
            required
            disabled={!formData.categoryId}
          />

          {/* Détails du bien */}
          <div className="space-y-4">
            <Input
              label="Nombre de chambres"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              placeholder="2"
            />
            <Input
              label="Nombre de salles de bain"
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              placeholder="1"
            />
            <Input
              label="Surface (m²)"
              type="number"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="65"
            />
          </div>

          {/* Photos et Vidéo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Photos et Vidéo
            </label>
            
            {/* Zone de drop */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                
                <div>
                  <p className="text-base font-medium text-gray-900 mb-1">
                    Sélectionner vos fichiers
                  </p>
                  <p className="text-xs text-gray-500">
                    Max 5 fichiers: 5 photos OU 4 photos + 1 vidéo
                  </p>
                </div>
                
                <div className="flex flex-col gap-1 text-xs text-gray-400">
                  <div className="flex items-center justify-center gap-1">
                    <Image className="h-3 w-3" />
                    <span>Photos: max 2MB</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>Vidéo: max 10MB</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Aperçu des fichiers */}
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Fichiers sélectionnés ({files.length}/5)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {files.map((file, index) => {
                    const isVideo = file.type.startsWith('video/');
                    const preview = getFilePreview(file);
                    
                    return (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                          {isVideo ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                              <Video className="h-6 w-6 text-purple-600 mb-1" />
                              <span className="text-xs font-medium text-purple-700">Vidéo</span>
                            </div>
                          ) : preview ? (
                            <img
                              src={preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                              <Camera className="h-6 w-6 text-green-600 mb-1" />
                              <span className="text-xs font-medium text-green-700">Image</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Overlay avec infos */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 rounded-lg flex items-end">
                          <div className="w-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <p className="text-xs font-medium truncate">{file.name}</p>
                            <p className="text-xs opacity-75">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
                          </div>
                        </div>
                        
                        {/* Bouton supprimer */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Équipements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Équipements</label>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesList.map((amenity) => (
                <label key={amenity.value} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.value)}
                    onChange={() => handleAmenityToggle(amenity.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <Input
            label="Numéro WhatsApp (optionnel)"
            value={formData.whatsappNumber}
            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
            placeholder="+22999154678"
          />

          {/* Bouton de soumission */}
          <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3"
            >
              {loading ? 'Publication...' : 'Publier l\'annonce'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};