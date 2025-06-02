
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchMovieByGenre, fetchMovieGenres, fetchMovieById } from '../../axios/axiosApi';
import type { Genre, Movie } from '../../type/types';

interface MoviesState {
  movies: Movie[];
  genres: Genre[];
  searchQuery: string;
  currentGenre: string;
  currentPage: number;
  totalPages: number;
  error: string | null;
  isLoading: boolean;
  movieDetail: Movie | null;
}

const initialState: MoviesState = {
  movies: [],
  genres: [],
  searchQuery: '',
  currentGenre: '',
  currentPage: 1,
  totalPages: 1,
  error: null,
  isLoading: false,
  movieDetail: null
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ genre, page }: { genre: string; page: number }) => {
    const response = await fetchMovieByGenre({genre, page});
    return {
      results: response.results,
      totalPages: Math.ceil(response.entries / 20)
    };
  }
);

export const fetchMovieDetail = createAsyncThunk(
  'movies/fetchMovieDetail',
  async (movieId: string) => {
    return await fetchMovieById(movieId);
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async () => {
    return await fetchMovieGenres();
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setGenre: (state, action: PayloadAction<string>) => {
      state.currentGenre = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearMovieDetail: (state) => {
      state.movieDetail = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies cases
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload.results;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      // Fetch movie detail cases
      .addCase(fetchMovieDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movieDetail = action.payload;
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch movie details';
      })
      // Fetch genres cases
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      });
  }
});

export const { 
  setSearchQuery, 
  setGenre, 
  setPage, 
  clearMovieDetail,
  clearError 
} = moviesSlice.actions;

export default moviesSlice.reducer;