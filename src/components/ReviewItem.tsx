import React from 'react';
import { useAppSelector } from '../store/hooks';
import type { Review } from '../type/types';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const themeClasses = {
    container: theme === 'light' 
      ? 'bg-gray-50 border-gray-200' 
      : 'bg-[#2a2a2a] border-gray-700',
    name: theme === 'light' ? 'text-gray-900' : 'text-white',
    date: theme === 'light' ? 'text-gray-500' : 'text-gray-400',
    comment: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
  };

  return (
    <div className={`p-4 rounded-lg border ${themeClasses.container}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className={`font-semibold ${themeClasses.name}`}>{review.name}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex space-x-1">{renderStars(review.rating)}</div>
            <span className={`text-sm ${themeClasses.date}`}>
              {review.rating}/5 stars
            </span>
          </div>
        </div>
        <span className={`text-sm ${themeClasses.date}`}>
          {formatDate(review.createdAt)}
        </span>
      </div>
      <p className={`${themeClasses.comment} leading-relaxed`}>{review.comment}</p>
    </div>
  );
};

export default ReviewItem;