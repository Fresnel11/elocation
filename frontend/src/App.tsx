import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { RequestsPage } from './pages/RequestsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { MessagesPage } from './pages/MessagesPage';
import { BookingsPage } from './pages/BookingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersManagement } from './pages/admin/UsersManagement';
import { AdsManagement } from './pages/admin/AdsManagement';
import { BookingsManagement } from './pages/admin/BookingsManagement';
import { NotificationsManagement } from './pages/admin/NotificationsManagement';
import { RolePermissionsManagement } from './pages/admin/RolePermissionsManagement';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';
import { AdminRoute } from './components/admin/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/messages' || location.pathname.startsWith('/admin');
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
          {!isAdminRoute && <Navbar />}
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
              <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
              <Route path="/requests/:id" element={<ProtectedRoute><RequestDetailPage /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UsersManagement /></AdminRoute>} />
              <Route path="/admin/ads" element={<AdminRoute><AdsManagement /></AdminRoute>} />
              <Route path="/admin/bookings" element={<AdminRoute><BookingsManagement /></AdminRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><NotificationsManagement /></AdminRoute>} />
              <Route path="/admin/permissions" element={<AdminRoute><RolePermissionsManagement /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
              <Route path="/create-ad" element={<ProtectedRoute><CreateAdPage /></ProtectedRoute>} />
              <Route path="/user/:userId" element={<UserProfilePage />} />
              <Route path="/annonces" element={<AnnoncesPage />} />
              <Route path="/annonce/:id" element={<AnnonceDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>
          {!hideFooter && <Footer />}
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;