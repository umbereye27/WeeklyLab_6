import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './slices/moviesSlice'
import watchlistReducer from './slices/watchlistSlice'
import reviewsReducer from './slices/reviewsSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    watchlist: watchlistReducer,
    reviews: reviewsReducer,
    theme: themeReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch