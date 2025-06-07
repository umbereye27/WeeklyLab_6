import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addReview } from '../store/slices/reviewsSlice';
import type { ReviewInput } from '../type/types';

interface ReviewFormProps {
  movieId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId }) => {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector((state) => state.reviews);
  const theme = useAppSelector((state) => state.theme.theme);

  const [formData, setFormData] = useState<ReviewInput>({
    name: '',
    rating: 5,
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<ReviewInput>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewInput> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(addReview({ movieId, reviewData: formData })).unwrap();
      setFormData({ name: '', rating: 5, comment: '' });
      setErrors({});
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleInputChange = (field: keyof ReviewInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const themeClasses = {
    container: theme === 'light' 
      ? 'bg-white border-gray-200' 
      : 'bg-[#1f1f1f] border-gray-700',
    input: theme === 'light'
      ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
      : 'bg-[#2a2a2a] border-gray-600 text-white focus:border-[#edb409]',
    label: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
    button: theme === 'light'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-[#edb409] hover:bg-[#c49608]',
    error: 'text-red-500',
  };

  return (
    <div className={`p-6 rounded-lg border ${themeClasses.container}`}>
      <h3 className={`text-xl font-semibold mb-4 ${themeClasses.label}`}>
        Write a Review
      </h3>

      {error && (
        <div className={`mb-4 p-3 rounded ${themeClasses.error} bg-red-100 dark:bg-red-900/20`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${themeClasses.input} transition-colors`}
            placeholder="Enter your name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className={`text-sm mt-1 ${themeClasses.error}`}>{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="rating" className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>
            Rating *
          </label>
          <select
            id="rating"
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
            className={`w-full px-3 py-2 rounded-md border ${themeClasses.input} transition-colors`}
            disabled={isSubmitting}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
          {errors.rating && (
            <p className={`text-sm mt-1 ${themeClasses.error}`}>{errors.rating}</p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>
            Comment *
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 rounded-md border ${themeClasses.input} transition-colors resize-vertical`}
            placeholder="Share your thoughts about this movie..."
            disabled={isSubmitting}
          />
          {errors.comment && (
            <p className={`text-sm mt-1 ${themeClasses.error}`}>{errors.comment}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-white rounded-md ${themeClasses.button} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;