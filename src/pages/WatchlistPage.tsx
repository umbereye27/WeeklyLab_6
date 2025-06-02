// pages/WatchlistPage.tsx
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { removeFromWatchlist, clearWatchlist } from '../store/slices/watchlistSlice'
import MovieCard from '../components/MovieCard'

const WatchlistPage: React.FC = () => {

  const dispatch = useAppDispatch()
  
  const { movies: watchlistMovies } = useAppSelector(state => state.watchlist)
  const [seeList, setSeeList] = useState(false)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRemoveFromWatchlist = (movieId: number, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent movie card click
    dispatch(removeFromWatchlist(movieId))
  }
//@ts-ignore
  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      dispatch(clearWatchlist())
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
        <div className="text-gray-400">
          <span className="mr-2">Total movies:</span>
          <span className="text-[#edb409]">{watchlistMovies.length}</span>
        </div>
      </div>

      <button
        onClick={() => setSeeList(!seeList)}
        className="mb-8 bg-[#edb409] text-white px-4 py-2 rounded hover:bg-[#c49608] transition-colors"
      >
        {seeList ? "Hide List" : "Show List"}
      </button>

      {seeList && watchlistMovies.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
          {watchlistMovies.map(movie => (
            <div key={movie.id} className="relative mb-4">

              <MovieCard movie={{
                ...movie,
                _id: (movie as any)._id ?? movie.id, // fallback if _id is missing
                titleText: (movie as any).titleText ?? { text: movie.title } // fallback if titleText is missing
              }} />
              <button
                onClick={(e) => handleRemoveFromWatchlist(movie.id, e)}
                className="absolute top-2 right-2 bg-[#edb409] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#c49608] transition-colors shadow-lg z-20"
                title="Remove from watchlist"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {seeList && watchlistMovies.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-xl">Your watchlist is empty</p>
          <p className="mt-2">Add some movies to get started!</p>
        </div>
      )}
    </div>
  )
}

export default WatchlistPage