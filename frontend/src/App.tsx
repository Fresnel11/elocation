import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyOtpPage } from './pages/auth/VerifyOtpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordOtpPage } from './pages/auth/ResetPasswordOtpPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnnoncesPage } from './pages/AnnoncesPage';
import { AdsPage } from './pages/AdsPage';
import { AnnonceDetailPage } from './pages/AnnonceDetailPage';
import { CreateAdPage } from './pages/CreateAdPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password-otp" element={<ResetPasswordOtpPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/ads" element={<ProtectedRoute><AdsPage /></ProtectedRoute>} />
              <Route path="/create-ad" element={<ProtectedRoute><CreateAdPage /></ProtectedRoute>} />
              <Route path="/user/:userId" element={<UserProfilePage />} />
              <Route path="/annonces" element={<AnnoncesPage />} />
              <Route path="/annonce/:id" element={<AnnonceDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;