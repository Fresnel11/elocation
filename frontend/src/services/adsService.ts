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

export const adsService = {
  async getAds(): Promise<AdsResponse> {
    const response = await api.get('/ads');
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