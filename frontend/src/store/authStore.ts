import { create } from 'zustand';
import { authService, User, LoginData, RegisterData } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<{ phone: string; otpPreview: string }>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({ 
        user: response.user, 
        token: response.access_token, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur de connexion', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({ isLoading: false });
      return { phone: response.phone, otpPreview: response.otpPreview };
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur d\'inscription', 
        isLoading: false 
      });
      throw error;
    }
  },

  requestOtp: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestOtp(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de l\'envoi de l\'OTP', 
        isLoading: false 
      });
      throw error;
    }
  },

  verifyOtp: async (email: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.verifyOtp(email, code);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Code OTP invalide', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    const token = authService.getStoredToken();
    const user = authService.getStoredUser();
    if (token && user) {
      set({ token, user });
    }
  }
}));