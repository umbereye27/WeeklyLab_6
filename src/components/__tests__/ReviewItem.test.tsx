import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReviewItem from '../ReviewItem';
import themeReducer from '../../store/slices/themeSlice';
import type { Review } from '../../type/types';

const createTestStore = (theme = 'dark') => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState: {
      theme: { theme },
    },
  });
};

const mockReview: Review = {
  id: '1',
  name: 'John Doe',
  rating: 4,
  comment: 'Great movie! Really enjoyed it.',
  movieId: '123',
  createdAt: new Date('2024-01-15T10:30:00Z'),
};

const renderWithStore = (component: React.ReactElement, store = createTestStore()) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('ReviewItem', () => {
  it('renders review data correctly', () => {
    renderWithStore(<ReviewItem review={mockReview} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great movie! Really enjoyed it.')).toBeInTheDocument();
    expect(screen.getByText('4/5 stars')).toBeInTheDocument();
  });

  it('renders correct number of filled stars', () => {
    renderWithStore(<ReviewItem review={mockReview} />);

    const stars = screen.getAllByRole('img', { hidden: true });
    const filledStars = stars.filter(star => 
      star.classList.contains('text-yellow-400')
    );
    const emptyStars = stars.filter(star => 
      star.classList.contains('text-gray-300')
    );

    expect(filledStars).toHaveLength(4);
    expect(emptyStars).toHaveLength(1);
  });

  it('formats date correctly', () => {
    renderWithStore(<ReviewItem review={mockReview} />);

    // The exact format may vary based on locale, but should contain date elements
    expect(screen.getByText(/Jan.*15.*2024/)).toBeInTheDocument();
  });

  it('applies light theme styles', () => {
    const lightStore = createTestStore('light');
    renderWithStore(<ReviewItem review={mockReview} />, lightStore);

    const container = screen.getByText('John Doe').closest('div');
    expect(container).toHaveClass('bg-gray-50');
  });

  it('applies dark theme styles', () => {
    const darkStore = createTestStore('dark');
    renderWithStore(<ReviewItem review={mockReview} />, darkStore);

    const container = screen.getByText('John Doe').closest('div');
    expect(container).toHaveClass('bg-[#2a2a2a]');
  });

  it('handles edge case with 1 star rating', () => {
    const oneStarReview = { ...mockReview, rating: 1 };
    renderWithStore(<ReviewItem review={oneStarReview} />);

    expect(screen.getByText('1/5 stars')).toBeInTheDocument();
    
    const stars = screen.getAllByRole('img', { hidden: true });
    const filledStars = stars.filter(star => 
      star.classList.contains('text-yellow-400')
    );
    
    expect(filledStars).toHaveLength(1);
  });

  it('handles edge case with 5 star rating', () => {
    const fiveStarReview = { ...mockReview, rating: 5 };
    renderWithStore(<ReviewItem review={fiveStarReview} />);

    expect(screen.getByText('5/5 stars')).toBeInTheDocument();
    
    const stars = screen.getAllByRole('img', { hidden: true });
    const filledStars = stars.filter(star => 
      star.classList.contains('text-yellow-400')
    );
    
    expect(filledStars).toHaveLength(5);
  });
});