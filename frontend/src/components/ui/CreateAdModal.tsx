import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, Minus, Image, Video, Trash2, Camera } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  id: string;
  name: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export const CreateAdModal: React.FC<CreateAdModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Charger les sous-catégories si une catégorie est déjà sélectionnée
  useEffect(() => {
    if (formData.categoryId && categories.length > 0) {
      fetchSubCategories(formData.categoryId);
    }
  }, [formData.categoryId, categories]);

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
    // Validation du nombre de fichiers
    if (selectedFiles.length > 5) {
      error('Erreur', 'Maximum 5 fichiers autorisés');
      return false;
    }
    
    // Validation des types et tailles
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
    
    // Validation des tailles
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
      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      error('Erreur', err.response?.data?.message || 'Une erreur est survenue lors de la publication.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      categoryId: '',
      subCategoryId: '',
      amenities: [],
      whatsappNumber: ''
    });
    setFiles([]);
    setUploadedMedia({photos: []});
    setSubCategories([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Publier une annonce</h2>

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

            {/* Prix et Localisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prix (FCFA/mois)"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
                placeholder="85000"
              />
              <Input
                label="Localisation"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
                placeholder="Cotonou, Littoral"
              />
            </div>

            {/* Catégorie et Sous-catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Catégorie"
                options={[{ value: '', label: 'Sélectionner une catégorie' }, ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                required
              />
              <Select
                label="Sous-catégorie"
                options={[{ value: '', label: 'Sélectionner une sous-catégorie' }, ...subCategories.map(subCat => ({ value: subCat.id, label: subCat.name }))]}
                value={formData.subCategoryId}
                onChange={(e) => handleChange('subCategoryId', e.target.value)}
                required
                disabled={!formData.categoryId || subCategories.length === 0}
              />
            </div>

            {/* Détails du bien */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Chambres"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                placeholder="2"
              />
              <Input
                label="Salles de bain"
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
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
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
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      Glissez vos fichiers ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-sm text-gray-500">
                      Maximum 5 fichiers: 5 photos OU 4 photos + 1 vidéo
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Image className="h-4 w-4" />
                      <span>Photos: max 2MB</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>Vidéo: max 10MB</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Aperçu des fichiers */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Fichiers sélectionnés ({files.length}/5)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map((file, index) => {
                      const isVideo = file.type.startsWith('video/');
                      const preview = getFilePreview(file);
                      
                      return (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                            {isVideo ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                                <Video className="h-8 w-8 text-purple-600 mb-2" />
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
                                <Camera className="h-8 w-8 text-green-600 mb-2" />
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
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map((amenity) => (
                  <label key={amenity.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.value)}
                      onChange={() => handleAmenityToggle(amenity.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
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

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Publication...' : 'Publier l\'annonce'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};