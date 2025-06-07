import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addReview as addReviewToFirebase, getReviews } from '../../firebase/reviews';
import type { Review, ReviewInput } from '../../type/types';

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

const initialState: ReviewsState = {
  reviews: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (movieId: string) => {
    return await getReviews(movieId);
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ movieId, reviewData }: { movieId: string; reviewData: ReviewInput }) => {
    return await addReviewToFirebase(movieId, reviewData);
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews cases
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      // Add review cases
      .addCase(addReview.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Failed to add review';
      });
  },
});

export const { clearReviews, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;