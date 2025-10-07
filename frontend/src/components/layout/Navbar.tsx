import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Settings, LogOut, ChevronDown, Home, MessageSquare, User, Mail, MapPin, Calendar, Heart, Download, BarChart3 } from 'lucide-react';
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
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-gradient-to-r from-white/90 via-white/80 to-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gradient-to-r from-blue-200/30 to-purple-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
          {/* Brand */}
          <Link to="/" className="flex items-center group hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                eLocation
              </span>
              <div className="text-xs text-gray-500 font-medium -mt-1">Bénin</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/ads" 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === '/ads' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
              }`}
            >
              <Home className="h-4 w-4" />
              Annonces
            </Link>

            <Link 
              to="/requests" 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === '/requests' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Demandes
            </Link>
            <Link 
              to="/messages" 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === '/messages' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
              }`}
            >
              <Mail className="h-4 w-4" />
              Messages
            </Link>
            {user && (
              <>
                <Link 
                  to="/bookings" 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === '/bookings' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Réservations
                </Link>
                <Link 
                  to="/favorites" 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === '/favorites' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  Favoris
                </Link>
                <Link 
                  to="/offline-ads" 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === '/offline-ads' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  <Download className="h-4 w-4" />
                  Hors ligne
                </Link>
                <Link 
                  to="/analytics" 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === '/analytics' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Statistiques
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link 
                  to="/about" 
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === '/about' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  À propos
                </Link>
                <Link 
                  to="/contact" 
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === '/contact' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  Contact
                </Link>
                <Link 
                  to="/faq" 
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === '/faq' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  FAQ
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-white/60 transition-all duration-200 backdrop-blur-sm border border-white/30 shadow-sm"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${getAvatarColor(user.firstName + user.lastName)}`}>
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-gray-800 font-semibold text-sm">
                        {user.firstName}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {user.lastName}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
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
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white/60" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg" asChild>
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>

          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl py-3 shadow-2xl border border-white/50">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-4 px-4 min-w-max">
              <Link
                to="/ads"
                className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                  location.pathname === '/ads' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Home className="h-5 w-5" />
              </Link>
              

              
              <Link
                to="/requests"
                className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                  location.pathname === '/requests' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
              
              <Link
                to="/messages"
                className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                  location.pathname === '/messages' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Mail className="h-5 w-5" />
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/bookings"
                    className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                      location.pathname === '/bookings' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    to="/favorites"
                    className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                      location.pathname === '/favorites' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    to="/offline-ads"
                    className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                      location.pathname === '/offline-ads' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Download className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    to="/analytics"
                    className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                      location.pathname === '/analytics' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Link>
                  
                  <div className="p-2.5 flex-shrink-0">
                    <NotificationBell />
                  </div>
                </>
              )}
              
              {!user && (
                <>
                  <Link
                    to="/about"
                    className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                      location.pathname === '/about' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    to="/contact"
                    className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                      location.pathname === '/contact' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Mail className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    to="/faq"
                    className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                      location.pathname === '/faq' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </>
              )}
              
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                    isUserMenuOpen 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isUserMenuOpen ? 'bg-white/20' : getAvatarColor(user.firstName + user.lastName)
                  } ${isUserMenuOpen ? 'text-white' : 'text-white'}`}>
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2.5 rounded-2xl transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-white/50 flex-shrink-0"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* User Menu Mobile */}
        {user && isUserMenuOpen && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-xl min-w-[160px]">
            <button
              onClick={() => {
                navigate('/settings');
                setIsUserMenuOpen(false);
              }}
              className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsUserMenuOpen(false);
              }}
              className="flex items-center w-full p-2 text-sm text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </>
  );
};