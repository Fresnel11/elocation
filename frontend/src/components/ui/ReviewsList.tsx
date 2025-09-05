import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { api } from '../../services/api';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface ReviewsListProps {
  adId: string;
  refreshTrigger?: number;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ adId, refreshTrigger }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    fetchReviews();
    fetchRating();
  }, [adId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/ad/${adId}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await api.get(`/reviews/ad/${adId}/rating`);
      setRating(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement de la note:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des avis...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      {rating.totalReviews > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-gray-900">
              {rating.averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(rating.averageRating))}
            <div className="text-sm text-gray-600">
              ({rating.totalReviews} avis)
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun avis pour le moment
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.user.firstName} {review.user.lastName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};