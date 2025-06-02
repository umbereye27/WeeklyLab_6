import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './slices/moviesSlice'
import watchlistReducer from './slices/watchlistSlice'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    watchlist: watchlistReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
