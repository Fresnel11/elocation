import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Menu, X, PlusCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">eLocation</span>
            <span className="text-sm text-blue-600 font-medium">Bénin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/ads" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Annonces
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              À propos
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              FAQ
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Publier
                  </Link>
                </Button>
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <Button variant="ghost" onClick={handleLogout} size="sm">
                    Déconnexion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button asChild>
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
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/ads"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Annonces
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              
              {user ? (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Publier
                    </Link>
                  </Button>
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-700 font-medium">{user.name}</span>
                  </div>
                  <Button variant="ghost" onClick={handleLogout} className="w-full">
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
                  <Button className="w-full" asChild>
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