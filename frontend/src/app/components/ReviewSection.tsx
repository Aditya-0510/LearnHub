'use client';
import React, { useState } from 'react';
import { Review } from '../types';
import { useAuth } from '@/context/AuthContext';
import { Star } from 'lucide-react';

interface ReviewSectionProps {
  courseId: number;
  reviews: Review[];
  onReviewAdded: () => void;
}

export default function ReviewSection({ courseId, reviews, onReviewAdded }: ReviewSectionProps) {
  const { isAuthenticated, role } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (err) {
      console.error(err);
      setError('Failed to submit review. You might have already reviewed this course or are not enrolled.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>

      <div className="space-y-6 mb-10">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="font-semibold text-gray-900 mr-2">
                    {review.user?.username || 'Anonymous'}
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {isAuthenticated && role === 'STUDENT' && (
        <div className="bg-white p-6 rounded-xl border border-cornflower-blue-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`focus:outline-none transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cornflower-blue-500 focus:border-transparent text-gray-900"
                placeholder="Share your experience..."
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="bg-cornflower-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-cornflower-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
