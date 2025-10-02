import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, phone: string, password: string, email?: string) => Promise<{ phone: string; otpPreview: string }>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    isLoading,
    isInitialized,
    error,
    login: storeLogin,
    register: storeRegister,
    requestOtp: storeRequestOtp,
    verifyOtp: storeVerifyOtp,
    logout: storeLogout,
    clearError,
    initializeAuth
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    await storeLogin({ email, password });
  };

  const register = async (firstName: string, lastName: string, phone: string, password: string, email?: string) => {
    return await storeRegister({ firstName, lastName, phone, password, email });
  };

  const requestOtp = async (email: string) => {
    await storeRequestOtp(email);
  };

  const verifyOtp = async (email: string, code: string) => {
    await storeVerifyOtp(email, code);
  };

  const logout = () => {
    storeLogout();
  };

  const value = {
    user,
    login,
    register,
    requestOtp,
    verifyOtp,
    logout,
    loading: isLoading,
    isInitialized,
    error,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};