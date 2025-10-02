import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { bookingsService, Booking } from '../services/bookingsService';
import { useToast } from '../context/ToastContext';

const statusConfig = {
  pending: { 
    label: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock 
  },
  confirmed: { 
    label: 'Confirmée', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle 
  },
  cancelled: { 
    label: 'Annulée', 
    color: 'bg-red-100 text-red-800', 
    icon: XCircle 
  },
  completed: { 
    label: 'Terminée', 
    color: 'bg-blue-100 text-blue-800', 
    icon: CheckCircle 
  },
};

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'tenant' | 'owner'>('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Aucun token trouvé, redirection vers login');
        window.location.href = '/login';
        return;
      }
      
      console.log('Token présent:', token.substring(0, 20) + '...');
      const response = await bookingsService.getMyBookings();
      setBookings(response.data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des réservations:', error);
      
      // Si erreur 401, rediriger vers login
      if (error.response?.status === 401) {
        console.log('Token expiré ou invalide, redirection vers login');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      showToast('error', 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string, reason?: string) => {
    try {
      await bookingsService.updateBooking(bookingId, { status, cancellationReason: reason });
      showToast('success', 'Statut mis à jour avec succès');
      fetchBookings();
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const getFilteredBookings = () => {
    // Cette logique sera améliorée quand on aura les rôles dans les bookings
    return bookings;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} jour${days > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
          <p className="text-gray-600">Gérez vos demandes de location et réservations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'all' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setSelectedTab('tenant')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'tenant' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mes demandes
          </button>
          <button
            onClick={() => setSelectedTab('owner')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'owner' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Demandes reçues
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {getFilteredBookings().length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune réservation
                </h3>
                <p className="text-gray-600">
                  Vos réservations apparaîtront ici une fois que vous en aurez effectué.
                </p>
              </CardContent>
            </Card>
          ) : (
            getFilteredBookings().map((booking) => {
              const StatusIcon = statusConfig[booking.status].icon;
              
              return (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Property Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={booking.ad.photos[0] ? `http://localhost:3000${booking.ad.photos[0]}` : '/placeholder.jpg'}
                          alt={booking.ad.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      </div>

                      {/* Booking Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {booking.ad.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Du {formatDate(booking.startDate)} au {formatDate(booking.endDate)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Durée: {getDuration(booking.startDate, booking.endDate)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig[booking.status].label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <p>Prix total: <span className="font-semibold">{booking.totalPrice.toLocaleString()} FCFA</span></p>
                            <p>Dépôt: <span className="font-semibold">{booking.deposit.toLocaleString()} FCFA</span></p>
                          </div>
                          
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(booking.id, 'cancelled', 'Annulé par l\'utilisateur')}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Annuler
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirmer
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Détails
                            </Button>
                          </div>
                        </div>

                        {booking.message && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Message:</span> {booking.message}
                            </p>
                          </div>
                        )}

                        {booking.cancellationReason && (
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-red-700">
                              <span className="font-medium">Raison d'annulation:</span> {booking.cancellationReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};