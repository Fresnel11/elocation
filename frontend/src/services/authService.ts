import { api } from './api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
  role: 'owner' | 'tenant';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  phone: string;
  otpPreview: string;
  expiresAt: string;
}

export interface OtpResponse {
  message: string;
  email?: string;
  otpPreview?: string;
  expiresAt?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async requestOtp(email: string): Promise<OtpResponse> {
    const response = await api.post('/auth/request-otp', { email });
    return response.data;
  },

  async verifyOtp(email: string, code: string): Promise<OtpResponse> {
    const response = await api.post('/auth/verify-otp', { email, code });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};