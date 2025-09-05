import { api } from './api';

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  photos: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  isAvailable: boolean;
  category: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AdsResponse {
  ads: Ad[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface LocationParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export const adsService = {
  async getAds(page: number = 1, limit: number = 10, location?: LocationParams): Promise<AdsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (location?.latitude && location?.longitude) {
      params.append('userLatitude', location.latitude.toString());
      params.append('userLongitude', location.longitude.toString());
      params.append('radius', (location.radius || 20).toString());
      params.append('sortBy', 'distance');
    }
    
    const response = await api.get(`/ads?${params.toString()}`);
    return response.data;
  },

  async getAdById(id: string): Promise<Ad> {
    const response = await api.get(`/ads/${id}`);
    return response.data;
  },

  async searchAds(params: any): Promise<Ad[]> {
    const response = await api.get('/ads/search', { params });
    return response.data;
  }
};