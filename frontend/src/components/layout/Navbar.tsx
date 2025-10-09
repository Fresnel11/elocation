import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Settings, LogOut, ChevronDown, Home, MessageSquare, User, Mail, MapPin, Calendar, Heart, Download, BarChart3, Info, Phone, HelpCircle, LogIn, UserPlus } from 'lucide-react';
import logoImage from '../../assets/e_location_blank.png';
import { Button } from '../ui/Button';
import { NotificationBell } from '../ui/NotificationBell';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  // Fermer le menu utilisateur quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Générer une couleur aléatoire basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isAdsPage = location.pathname === '/ads';

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center group hover:scale-105 transition-all duration-300">
            <img src={logoImage} alt="eLocation Bénin" className="h-10 w-10 mr-3" />
            <span className="text-3xl font-bold" style={{color: '#2563eb'}}>
              eLocation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link 
              to="/ads" 
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                location.pathname === '/ads' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Annonces
            </Link>

            {user && (
              <>
                <Link 
                  to="/requests" 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/requests' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  Demandes
                </Link>
                <Link 
                  to="/messages" 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/messages' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Mail className="h-5 w-5" />
                  Messages
                </Link>
              </>
            )}
            {user && (
              <>
                <Link 
                  to="/bookings" 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/bookings' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  Réservations
                </Link>
                <Link 
                  to="/favorites" 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/favorites' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  Favoris
                </Link>
                <Link 
                  to="/offline-ads" 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/offline-ads' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Download className="h-5 w-5" />
                  Hors ligne
                </Link>
                <Link 
                  to="/analytics" 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/analytics' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  Statistiques
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link 
                  to="/about" 
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/about' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  À propos
                </Link>
                <Link 
                  to="/contact" 
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/contact' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  Contact
                </Link>
                <Link 
                  to="/faq" 
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/faq' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  FAQ
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <NotificationBell />
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 border border-gray-200 shadow-sm"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg ${getAvatarColor(user.firstName + user.lastName)}`}>
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-gray-800 font-semibold text-base">
                        {user.firstName}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {user.lastName}
                      </span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Menu déroulant */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 py-2 z-50">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 transition-all duration-200 rounded-xl mx-2"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Paramètres
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200 rounded-xl mx-2"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="lg" className="rounded-2xl hover:bg-blue-50 font-semibold" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg font-semibold" asChild>
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl z-40">
          <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <Link 
              to="/ads" 
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                location.pathname === '/ads' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Home className="h-5 w-5" />
              Annonces
            </Link>

            {user && (
              <>
                <Link 
                  to="/requests" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/requests' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  Demandes
                </Link>
                <Link 
                  to="/messages" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/messages' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Mail className="h-5 w-5" />
                  Messages
                </Link>
                <Link 
                  to="/bookings" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/bookings' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  Réservations
                </Link>
                <Link 
                  to="/favorites" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/favorites' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  Favoris
                </Link>
                <Link 
                  to="/offline-ads" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/offline-ads' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Download className="h-5 w-5" />
                  Hors ligne
                </Link>
                <Link 
                  to="/analytics" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/analytics' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  Statistiques
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/about' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Info className="h-5 w-5" />
                  À propos
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/contact' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Phone className="h-5 w-5" />
                  Contact
                </Link>
                <Link 
                  to="/faq" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    location.pathname === '/faq' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                  FAQ
                </Link>
              </>
            )}

            {/* Actions mobiles */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(user.firstName + user.lastName)}`}>
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">Connecté</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-colors font-semibold"
                  >
                    <LogIn className="h-5 w-5" />
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-colors font-semibold"
                  >
                    <UserPlus className="h-5 w-5" />
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};