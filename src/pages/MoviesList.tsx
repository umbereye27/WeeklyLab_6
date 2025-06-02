import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMovies, setGenre, setPage, fetchGenres } from "../store/slices/moviesSlice";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const MovieList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { movies, currentGenre, currentPage, totalPages, isLoading, error } =
    useAppSelector((state) => state.movies);

  useEffect(() => {
    const genre = searchParams.get("genre");
    if (genre) {
      dispatch(setGenre(genre));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMovies({ genre: currentGenre, page: currentPage }));
  }, [dispatch, currentGenre, currentPage]);


  // const handleSearch = (query: string) => {
  //   if (query) {
  //     setSearchParams({ search: query });
  //   } else {
  //     setSearchParams({});
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner size="large" className="border-[#edb409]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-red-500">
        Error: {error}
      </div>
    );
  }

  // Split movies into sections
  const recentlyAdded = movies.slice(0, 5);
  const trending = movies.slice(5, 10);


  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      {movies[0] && (
        <div className="relative h-[600px] mb-12 rounded-lg overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={movies[0].primaryImage?.url}
              alt={movies[0].titleText?.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 p-12 w-1/2">
            <h2 className="text-5xl font-bold text-white mb-4">{movies[0].titleText?.text}</h2>
            <p className="text-lg text-gray-300 mb-6">{movies[0].overview}</p>
            <div className="flex space-x-4">
              <button className="px-8 py-3 bg-white text-black rounded-md hover:bg-white/90 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Play
              </button>
              <button className="px-8 py-3 bg-gray-600/80 text-white rounded-md hover:bg-gray-600/90 flex items-center">
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recently Added Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="text-[#edb409] mr-2">M</span>
          Recently Movie
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {recentlyAdded.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Trending Now</h2>
        <div className="grid grid-cols-5 gap-4">
          {trending.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      

      <div className="mt-8 mb-16">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setPage(page))}
        />
      </div>
    </div>
  );
};

export default MovieList;

