import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Settings, LogOut, ChevronDown, Home, MessageSquare, User, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/elocation-512.png';

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
      <nav className="hidden md:block bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="eLocation Bénin" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/ads" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/ads' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              <Home className="h-4 w-4" />
              Annonces
            </Link>
            <Link 
              to="/requests" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/requests' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Demandes
            </Link>
            <Link 
              to="/messages" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/messages' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              <Mail className="h-4 w-4" />
              Messages
            </Link>
            {!user && (
              <>
                <Link 
                  to="/about" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === '/about' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  À propos
                </Link>
                <Link 
                  to="/contact" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Contact
                </Link>
                <Link 
                  to="/faq" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === '/faq' ? 'text-blue-600' : 'text-gray-700'
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
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/60 transition-all duration-200 backdrop-blur-sm"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(user.firstName + user.lastName)}`}>
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      {user.firstName}
                    </span>
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
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>

          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/20 backdrop-blur-md rounded-full px-12 py-1.5 shadow-lg border border-white/40">
          <div className="flex items-center gap-8">
            <Link
              to="/ads"
              className={`p-2 rounded-full transition-all duration-200 ${
                location.pathname === '/ads' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4" />
            </Link>
            
            <Link
              to="/requests"
              className={`p-2 rounded-full transition-all duration-200 ${
                location.pathname === '/requests' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
            </Link>
            
            <Link
              to="/messages"
              className={`p-2 rounded-full transition-all duration-200 ${
                location.pathname === '/messages' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Mail className="h-4 w-4" />
            </Link>
            
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isUserMenuOpen 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(user.firstName + user.lastName)}`}>
                  {getInitials(user.firstName, user.lastName)}
                </div>
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900"
              >
                <User className="h-4 w-4" />
              </Link>
            )}
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