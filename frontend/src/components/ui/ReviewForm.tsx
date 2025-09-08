import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './Button';
import { api } from '../../services/api';

interface ReviewFormProps {
  adId: string;
  onReviewAdded: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ adId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    try {
      await api.post('/reviews', {
        adId,
        rating,
        comment
      });
      setRating(0);
      setComment('');
      onReviewAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Impossible d\'ajouter l\'avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Laisser un avis</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-colors duration-200"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Partagez votre expérience..."
        />
      </div>

      <Button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? 'Publication...' : 'Publier l\'avis'}
      </Button>
    </form>
  );
};