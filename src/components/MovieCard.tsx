import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../type/types';
import LoadingSpinner from './LoadingSpinner';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '' }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = movie.primaryImage?.url || "https://via.placeholder.com/500x750";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`relative block bg-[#1f2023] rounded-lg overflow-hidden transform transition-all duration-300 ${
        isHovered ? 'scale-105 shadow-xl z-10' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3]">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2a2b2f]">
            <LoadingSpinner size="small" className="border-[#edb409]" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={movie.titleText.text}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          } ${isHovered ? 'brightness-50' : ''}`}
          onLoad={() => setIsImageLoading(false)}
        />
        
        {/* Rating Badge */}
        {movie.vote_average && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Hover Content */}
        <div className={`absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <h3 className="text-white text-lg font-bold mb-1 line-clamp-2">
            {movie.titleText.text}
          </h3>
          
          {movie.releaseYear && (
            <p className="text-gray-300 text-sm mb-2">
              {movie.releaseYear.year}
            </p>
          )}
          
          {movie.genres && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.genres.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className="inline-block bg-[#edb409] text-white px-2 py-0.5 rounded text-xs"
                >
                  {genre.text}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;