import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Settings, LogOut, ChevronDown } from 'lucide-react';
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
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
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
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/ads' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Annonces
            </Link>
            <Link 
              to="/requests" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/requests' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Demandes
            </Link>
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
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Paramètres
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              <Link
                to="/ads"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/ads' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Annonces
              </Link>
              <Link
                to="/requests"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/requests' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Demandes
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/about' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/faq' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              
              {user ? (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center space-x-3 p-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(user.firstName + user.lastName)}`}>
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => {
                      navigate('/settings');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      S'inscrire
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};