// store/slices/watchlistSlice.ts
import { createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
interface WatchlistMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  overview: string
}

interface WatchlistState {
  movies: WatchlistMovie[]
}

// Load watchlist from localStorage
const loadWatchlistFromStorage = (): WatchlistMovie[] => {
  try {
    const stored = localStorage.getItem('movieWatchlist')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading watchlist from localStorage:', error)
    return []
  }
}

// Save watchlist to localStorage
const saveWatchlistToStorage = (movies: WatchlistMovie[]) => {
  try {
    localStorage.setItem('movieWatchlist', JSON.stringify(movies))
  } catch (error) {
    console.error('Error saving watchlist to localStorage:', error)
  }
}

const initialState: WatchlistState = {
  movies: loadWatchlistFromStorage()
}

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<WatchlistMovie>) => {
      const movieExists = state.movies.find(movie => movie.id === action.payload.id)
      if (!movieExists) {
        state.movies.push(action.payload)
        saveWatchlistToStorage(state.movies)
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<number>) => {
      state.movies = state.movies.filter(movie => movie.id !== action.payload)
      saveWatchlistToStorage(state.movies)
    },
    clearWatchlist: (state) => {
      state.movies = []
      saveWatchlistToStorage(state.movies)
    }
  }
})

export const {
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist
} = watchlistSlice.actions

export default watchlistSlice.reducer