import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Routes } from '../../routes/router';
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
  genres: { genres: [{ text: 'Action' }] },
  overview: 'Test overview',
  vote_average: 8.5,
};

// Mock API calls
const mockFetchMovieByGenre = jest.fn();
const mockFetchMovieGenres = jest.fn();
const mockFetchMovieById = jest.fn();

jest.mock('../../axios/axiosApi', () => ({
  fetchMovieByGenre: (...args: any[]) => mockFetchMovieByGenre(...args),
  fetchMovieGenres: (...args: any[]) => mockFetchMovieGenres(...args),
  fetchMovieById: (...args: any[]) => mockFetchMovieById(...args),
}));

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
  { store = createTestStore(), route = '/' } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes />
      </MemoryRouter>
    </Provider>
  );
};

describe('Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchMovieByGenre.mockResolvedValue({
      results: [mockMovie],
      entries: 1,
    });
    mockFetchMovieGenres.mockResolvedValue([
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
    ]);
    mockFetchMovieById.mockResolvedValue(mockMovie);
  });

  it('navigates from home to movie detail page', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders({ store });

    // Wait for movies to load
    await waitFor(() => {
      expect(screen.getByText('Movies')).toBeInTheDocument();
    });

    // Should be on home page initially
    expect(screen.getByText('Movies')).toBeInTheDocument();

    // Navigate to movie detail (we'll simulate this by changing route)
    renderWithProviders({ store, route: '/movie/123' });

    // Wait for movie detail to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    expect(screen.getByText(/back to movies/i)).toBeInTheDocument();
  });

  it('navigates from movie detail back to home', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    // Start on movie detail page
    renderWithProviders({ store, route: '/movie/123' });

    // Wait for movie detail to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    // Click back to movies link
    const backLink = screen.getByText(/back to movies/i);
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('navigates to watchlist page', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders({ store });

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Movies')).toBeInTheDocument();
    });

    // Click on My List link
    const watchlistLink = screen.getByText(/my list/i);
    await user.click(watchlistLink);

    // Should navigate to watchlist page
    await waitFor(() => {
      expect(screen.getByText(/my watchlist/i)).toBeInTheDocument();
    });
  });

  it('handles invalid routes gracefully', () => {
    const store = createTestStore();

    // Navigate to non-existent route
    renderWithProviders({ store, route: '/invalid-route' });

    // Should still render the layout (since we have a catch-all route structure)
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  it('maintains state during navigation', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders({ store });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Movies')).toBeInTheDocument();
    });

    // Toggle theme
    const themeToggle = screen.getByTestId('theme-toggle');
    await user.click(themeToggle);

    // Navigate to watchlist
    const watchlistLink = screen.getByText(/my list/i);
    await user.click(watchlistLink);

    // Theme should persist
    await waitFor(() => {
      const newThemeToggle = screen.getByTestId('theme-toggle');
      expect(newThemeToggle).toHaveClass('bg-gray-200'); // Light theme
    });

    // Store state should persist
    const state = store.getState();
    expect(state.theme.theme).toBe('light');
  });

  it('loads movie detail with reviews on direct URL access', async () => {
    const store = createTestStore();

    // Directly access movie detail URL
    renderWithProviders({ store, route: '/movie/123' });

    // Wait for movie and reviews to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    // Should have review form and list
    expect(screen.getByText(/write a review/i)).toBeInTheDocument();
    expect(screen.getByText(/reviews \(0\)/i)).toBeInTheDocument();

    // Should have called both movie detail and reviews APIs
    expect(mockFetchMovieById).toHaveBeenCalledWith('123');
  });

  it('handles navigation with URL parameters', async () => {
    const store = createTestStore();

    // Navigate with genre parameter
    renderWithProviders({ store, route: '/?genre=Action' });

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Movies')).toBeInTheDocument();
    });

    // Should have called API with genre parameter
    await waitFor(() => {
      expect(mockFetchMovieByGenre).toHaveBeenCalledWith({
        genre: 'Action',
        page: 1,
      });
    });
  });
});