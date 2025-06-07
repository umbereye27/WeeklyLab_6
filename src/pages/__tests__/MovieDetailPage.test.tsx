import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MovieDetailPage from '../MovieDetailPage';
import moviesReducer from '../../store/slices/moviesSlice';
import reviewsReducer from '../../store/slices/reviewsSlice';
import themeReducer from '../../store/slices/themeSlice';
import watchlistReducer from '../../store/slices/watchlistSlice';
import type { Movie } from '../../type/types';

// Mock Firebase
jest.mock('../../firebase/reviews', () => ({
  addReview: jest.fn(),
  getReviews: jest.fn().mockResolvedValue([]),
}));

const mockMovie: Movie = {
  id: 123,
  _id: '123',
  titleText: { text: 'Test Movie' },
  releaseYear: { year: 2024 },
  primaryImage: { url: 'https://example.com/poster.jpg' },
  genres: { genres: [{ text: 'Action' }, { text: 'Drama' }] },
  overview: 'This is a test movie overview.',
  vote_average: 8.5,
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
        movieDetail: null,
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

describe('MovieDetailPage', () => {
  it('displays loading state', () => {
    const store = createTestStore({
      movies: {
        movies: [],
        genres: [],
        searchQuery: '',
        currentGenre: '',
        currentPage: 1,
        totalPages: 1,
        error: null,
        isLoading: true,
        movieDetail: null,
      },
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const store = createTestStore({
      movies: {
        movies: [],
        genres: [],
        searchQuery: '',
        currentGenre: '',
        currentPage: 1,
        totalPages: 1,
        error: 'Failed to fetch movie',
        isLoading: false,
        movieDetail: null,
      },
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch movie/i)).toBeInTheDocument();
  });

  it('displays movie not found state', () => {
    const store = createTestStore({
      movies: {
        movies: [],
        genres: [],
        searchQuery: '',
        currentGenre: '',
        currentPage: 1,
        totalPages: 1,
        error: null,
        isLoading: false,
        movieDetail: null,
      },
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    expect(screen.getByText(/movie not found/i)).toBeInTheDocument();
  });

  it('displays movie details correctly', () => {
    const store = createTestStore({
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
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText(/release year: 2024/i)).toBeInTheDocument();
    expect(screen.getByText('This is a test movie overview.')).toBeInTheDocument();
    expect(screen.getByText('8.5/10')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  it('displays movie poster', () => {
    const store = createTestStore({
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
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    const poster = screen.getByAltText('Test Movie');
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', 'https://example.com/poster.jpg');
  });

  it('includes review form and review list', () => {
    const store = createTestStore({
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
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    expect(screen.getByText(/write a review/i)).toBeInTheDocument();
    expect(screen.getByText(/reviews \(0\)/i)).toBeInTheDocument();
  });

  it('includes watchlist button', () => {
    const store = createTestStore({
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
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    expect(screen.getByText(/add to watchlist/i)).toBeInTheDocument();
  });

  it('includes back to movies link', () => {
    const store = createTestStore({
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
    });

    renderWithProviders(<MovieDetailPage />, { store });
    
    const backLink = screen.getByText(/back to movies/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });
});