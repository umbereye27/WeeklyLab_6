import React from 'react';
import { useAppSelector } from '../store/hooks';
import ReviewItem from './ReviewItem';
import LoadingSpinner from './LoadingSpinner';

const ReviewList: React.FC = () => {
  const { reviews, isLoading, error } = useAppSelector((state) => state.reviews);
  const theme = useAppSelector((state) => state.theme.theme);

  const themeClasses = {
    title: theme === 'light' ? 'text-gray-900' : 'text-white',
    noReviews: theme === 'light' ? 'text-gray-500' : 'text-gray-400',
    error: 'text-red-500',
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className={`text-xl font-semibold ${themeClasses.title}`}>Reviews</h3>
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className={`text-xl font-semibold ${themeClasses.title}`}>Reviews</h3>
        <p className={themeClasses.error}>Error loading reviews: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className={`text-xl font-semibold ${themeClasses.title}`}>
        Reviews ({reviews.length})
      </h3>
      
      {reviews.length === 0 ? (
        <p className={themeClasses.noReviews}>
          No reviews yet. Be the first to review this movie!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;