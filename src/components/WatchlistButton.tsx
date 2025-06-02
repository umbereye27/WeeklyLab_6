import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { Movie } from '../type/types';
import { addToWatchlist, removeFromWatchlist } from '../store/slices/watchlistSlice';

interface WatchlistButtonProps {
  movie: Movie;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ movie }) => {
  const dispatch = useAppDispatch();
  const isInWatchlist = useSelector((state: RootState) =>
    state.watchlist.movies.some((m) => m.id === movie.id)
  );

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when inside a Link component
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      //@ts-ignore
      dispatch(addToWatchlist(movie));
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`group px-6 py-3 rounded-md transition-all duration-300 flex items-center space-x-2 
      ${isInWatchlist
        ? 'bg-gray-600/80 hover:bg-gray-600/90 text-white'
        : 'bg-gray-600/80 hover:bg-gray-600/90 text-white'
      }`}
      aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-transform duration-300 ${
          isInWatchlist ? 'transform rotate-0' : 'transform rotate-0'
        }`}
        fill={isInWatchlist ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
      <span>{isInWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
    </button>
  );
};

export default WatchlistButton;
