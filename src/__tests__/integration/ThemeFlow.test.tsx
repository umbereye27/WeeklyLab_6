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

// Mock Firebase
jest.mock('../../firebase/reviews', () => ({
  addReview: jest.fn(),
  getReviews: jest.fn().mockResolvedValue([]),
}));

// Mock API calls
jest.mock('../../axios/axiosApi', () => ({
  fetchMovieByGenre: jest.fn().mockResolvedValue({
    results: [],
    entries: 0,
  }),
  fetchMovieGenres: jest.fn().mockResolvedValue([]),
  fetchMovieById: jest.fn().mockResolvedValue(null),
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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

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

describe('Theme Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('dark');
  });

  it('toggles theme and persists to localStorage', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders({ store });

    // Find theme toggle button
    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();

    // Initially dark theme
    expect(themeToggle).toHaveClass('bg-gray-700');

    // Click to toggle to light theme
    await user.click(themeToggle);

    // Check that theme changed in store
    await waitFor(() => {
      const state = store.getState();
      expect(state.theme.theme).toBe('light');
    });

    // Check that localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith('movieExplorerTheme', 'light');

    // Check that button styles changed
    await waitFor(() => {
      expect(themeToggle).toHaveClass('bg-gray-200');
    });
  });

  it('loads theme from localStorage on initialization', () => {
    localStorageMock.getItem.mockReturnValue('light');

    const store = createTestStore();
    renderWithProviders({ store });

    const state = store.getState();
    expect(state.theme.theme).toBe('light');
  });

  it('applies theme to document element', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders({ store });

    // Check initial theme application
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.className).toBe('dark');

    // Toggle theme
    const themeToggle = screen.getByTestId('theme-toggle');
    await user.click(themeToggle);

    // Check theme application after toggle
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.className).toBe('light');
    });
  });

  it('maintains theme consistency across navigation', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders({ store });

    // Toggle to light theme
    const themeToggle = screen.getByTestId('theme-toggle');
    await user.click(themeToggle);

    await waitFor(() => {
      const state = store.getState();
      expect(state.theme.theme).toBe('light');
    });

    // Navigate to watchlist
    const watchlistLink = screen.getByText(/my list/i);
    await user.click(watchlistLink);

    // Theme should persist
    await waitFor(() => {
      const state = store.getState();
      expect(state.theme.theme).toBe('light');
    });

    // Theme toggle should still be in light mode
    const newThemeToggle = screen.getByTestId('theme-toggle');
    expect(newThemeToggle).toHaveClass('bg-gray-200');
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const store = createTestStore();
    
    // Should not throw and should default to dark theme
    expect(() => renderWithProviders({ store })).not.toThrow();
    
    const state = store.getState();
    expect(state.theme.theme).toBe('dark');
  });

  it('handles localStorage setItem errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error');
    });

    const store = createTestStore();
    renderWithProviders({ store });

    const themeToggle = screen.getByTestId('theme-toggle');
    await user.click(themeToggle);

    // Theme should still change in store despite localStorage error
    await waitFor(() => {
      const state = store.getState();
      expect(state.theme.theme).toBe('light');
    });

    // Error should be logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save theme to localStorage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});