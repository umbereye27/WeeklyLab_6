import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MovieDetailPage from '../../pages/MovieDetailPage';
import moviesReducer from '../../store/slices/moviesSlice';
import reviewsReducer from '../../store/slices/reviewsSlice';
import themeReducer from '../../store/slices/themeSlice';
import watchlistReducer from '../../store/slices/watchlistSlice';
import type { Movie, Review } from '../../type/types';

// Mock Firebase functions
const mockAddReview = jest.fn();
const mockGetReviews = jest.fn();

jest.mock('../../firebase/reviews', () => ({
  addReview: (...args: any[]) => mockAddReview(...args),
  getReviews: (...args: any[]) => mockGetReviews(...args),
}));

const mockMovie: Movie = {
  id: 123,
  _id: '123',
  titleText: { text: 'Test Movie' },
  releaseYear: { year: 2024 },
  primaryImage: { url: 'https://example.com/poster.jpg' },
  genres: { genres: [{ text: 'Action' }] },
  overview: 'Test overview',
  vote_average: 8.5,
};

const mockReview: Review = {
  id: 'review-1',
  name: 'John Doe',
  rating: 4,
  comment: 'Great movie!',
  movieId: '123',
  createdAt: new Date('2024-01-15T10:30:00Z'),
};

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      movies: moviesReducer,
      reviews: reviewsReducer,
      theme: themeReducer,
      watchlist: watchlistReducer,
    },
    preloadedState: {
      movies: {
        movies: [],
        genres: [],
        searchQuery: '',
        currentGenre: '',
        currentPage: 1,
        totalPages: 1,
        error: null,
        isLoading: false,
        movieDetail: mockMovie,
      },
      reviews: {
        reviews: [],
        isLoading: false,
        error: null,
        isSubmitting: false,
      },
      theme: {
        theme: 'dark',
      },
      watchlist: {
        movies: [],
      },
      ...initialState,
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  { store = createTestStore(), route = '/movie/123' } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('Review Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetReviews.mockResolvedValue([]);
    mockAddReview.mockResolvedValue(mockReview);
  });

  it('completes full review submission flow', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders(<MovieDetailPage />, { store });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    // Initially no reviews
    expect(screen.getByText(/reviews \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();

    // Fill out review form
    const nameInput = screen.getByLabelText(/your name/i);
    const ratingSelect = screen.getByLabelText(/rating/i);
    const commentTextarea = screen.getByLabelText(/comment/i);
    const submitButton = screen.getByRole('button', { name: /submit review/i });

    await user.type(nameInput, 'John Doe');
    await user.selectOptions(ratingSelect, '4');
    await user.type(commentTextarea, 'Great movie!');

    // Submit the form
    await user.click(submitButton);

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockAddReview).toHaveBeenCalledWith('123', {
        name: 'John Doe',
        rating: 4,
        comment: 'Great movie!',
      });
    });

    // Check that form is cleared
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(commentTextarea).toHaveValue('');
    });

    // Check that review count is updated
    await waitFor(() => {
      expect(screen.getByText(/reviews \(1\)/i)).toBeInTheDocument();
    });

    // Check that the new review appears in the list
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great movie!')).toBeInTheDocument();
    expect(screen.getByText('4/5 stars')).toBeInTheDocument();
  });

  it('handles review submission errors gracefully', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    // Mock Firebase to reject
    mockAddReview.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<MovieDetailPage />, { store });

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    // Fill out and submit form
    const nameInput = screen.getByLabelText(/your name/i);
    const commentTextarea = screen.getByLabelText(/comment/i);
    const submitButton = screen.getByRole('button', { name: /submit review/i });

    await user.type(nameInput, 'John Doe');
    await user.type(commentTextarea, 'Great movie!');
    await user.click(submitButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to add review/i)).toBeInTheDocument();
    });

    // Form should still contain the data
    expect(nameInput).toHaveValue('John Doe');
    expect(commentTextarea).toHaveValue('Great movie!');
  });

  it('loads existing reviews on page mount', async () => {
    const existingReviews = [
      {
        id: 'review-1',
        name: 'Alice',
        rating: 5,
        comment: 'Amazing!',
        movieId: '123',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 'review-2',
        name: 'Bob',
        rating: 3,
        comment: 'It was okay.',
        movieId: '123',
        createdAt: new Date('2024-01-14T15:20:00Z'),
      },
    ];

    mockGetReviews.mockResolvedValue(existingReviews);

    const store = createTestStore();
    renderWithProviders(<MovieDetailPage />, { store });

    // Wait for reviews to load
    await waitFor(() => {
      expect(screen.getByText(/reviews \(2\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Amazing!')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('It was okay.')).toBeInTheDocument();
  });

  it('works correctly in light theme', async () => {
    const user = userEvent.setup();
    const store = createTestStore({
      theme: { theme: 'light' },
    });

    renderWithProviders(<MovieDetailPage />, { store });

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    // Check that light theme styles are applied
    const reviewForm = screen.getByText(/write a review/i).closest('div');
    expect(reviewForm).toHaveClass('bg-white');

    // Form should still work in light theme
    const nameInput = screen.getByLabelText(/your name/i);
    const commentTextarea = screen.getByLabelText(/comment/i);
    const submitButton = screen.getByRole('button', { name: /submit review/i });

    await user.type(nameInput, 'Test User');
    await user.type(commentTextarea, 'Test comment');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddReview).toHaveBeenCalled();
    });
  });
});