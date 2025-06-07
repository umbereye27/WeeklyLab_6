import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReviewForm from '../ReviewForm';
import reviewsReducer from '../../store/slices/reviewsSlice';
import themeReducer from '../../store/slices/themeSlice';

// Mock Firebase
jest.mock('../../firebase/reviews', () => ({
  addReview: jest.fn(),
  getReviews: jest.fn(),
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      reviews: reviewsReducer,
      theme: themeReducer,
    },
    preloadedState: {
      reviews: {
        reviews: [],
        isLoading: false,
        error: null,
        isSubmitting: false,
      },
      theme: {
        theme: 'dark',
      },
      ...initialState,
    },
  });
};

const renderWithStore = (component: React.ReactElement, store = createTestStore()) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('ReviewForm', () => {
  const mockMovieId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    renderWithStore(<ReviewForm movieId={mockMovieId} />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithStore(<ReviewForm movieId={mockMovieId} />);

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/comment is required/i)).toBeInTheDocument();
  });

  it('clears validation errors when user types', async () => {
    const user = userEvent.setup();
    renderWithStore(<ReviewForm movieId={mockMovieId} />);

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/your name/i);
    await user.type(nameInput, 'John Doe');

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    renderWithStore(<ReviewForm movieId={mockMovieId} />, store);

    const nameInput = screen.getByLabelText(/your name/i);
    const ratingSelect = screen.getByLabelText(/rating/i);
    const commentTextarea = screen.getByLabelText(/comment/i);
    const submitButton = screen.getByRole('button', { name: /submit review/i });

    await user.type(nameInput, 'John Doe');
    await user.selectOptions(ratingSelect, '4');
    await user.type(commentTextarea, 'Great movie!');
    await user.click(submitButton);

    // Form should be cleared after successful submission
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(commentTextarea).toHaveValue('');
    });
  });

  it('disables form when submitting', () => {
    const store = createTestStore({
      reviews: {
        reviews: [],
        isLoading: false,
        error: null,
        isSubmitting: true,
      },
    });

    renderWithStore(<ReviewForm movieId={mockMovieId} />, store);

    expect(screen.getByLabelText(/your name/i)).toBeDisabled();
    expect(screen.getByLabelText(/rating/i)).toBeDisabled();
    expect(screen.getByLabelText(/comment/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });

  it('displays error message when submission fails', () => {
    const store = createTestStore({
      reviews: {
        reviews: [],
        isLoading: false,
        error: 'Failed to submit review',
        isSubmitting: false,
      },
    });

    renderWithStore(<ReviewForm movieId={mockMovieId} />, store);

    expect(screen.getByText(/failed to submit review/i)).toBeInTheDocument();
  });

  it('applies light theme styles correctly', () => {
    const store = createTestStore({
      theme: {
        theme: 'light',
      },
    });

    renderWithStore(<ReviewForm movieId={mockMovieId} />, store);

    const container = screen.getByText(/write a review/i).closest('div');
    expect(container).toHaveClass('bg-white');
  });
});