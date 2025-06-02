import React, { useEffect } from "react";
import type { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import { fetchMovieDetail } from "../store/slices/moviesSlice";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import WatchlistButton from "../components/WatchlistButton";

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const movieDetail = useSelector(
    (state: RootState) => state.movies.movieDetail
  );
  const isLoading = useSelector((state: RootState) => state.movies.isLoading);
  const error = useSelector((state: RootState) => state.movies.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetail(id));
    }
  }, [dispatch, id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  if (!movieDetail)
    return (
      <div className="flex justify-center items-center min-h-screen">
        No details found.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-white mb-6 hover:text-[#edb409] transition-colors"
      >
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Movies
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {movieDetail.primaryImage?.url && (
            <img
              src={movieDetail.primaryImage.url}
              alt={movieDetail.titleText?.text}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-white mb-4">
            {movieDetail.titleText?.text}
          </h1>

          {movieDetail.releaseYear?.year && (
            <p className="text-gray-400 mb-4">
              Release Year: {movieDetail.releaseYear.year}
            </p>
          )}

          {movieDetail.overview && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Overview
              </h2>
              <p className="text-gray-300">{movieDetail.overview}</p>
            </div>
          )}

          <div className="flex space-x-4 mb-8">            <button className="px-6 py-3 bg-[#edb409] text-white rounded-md hover:bg-[#c49608] transition-colors flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              </svg>
              Play
            </button>
            <WatchlistButton movie={movieDetail} />
          </div>

          {movieDetail.vote_average && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Rating</h2>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span className="text-white font-semibold">
                  {movieDetail.vote_average}/10
                </span>
              </div>
            </div>
          )}

          {movieDetail.genres && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movieDetail.genres.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                  >
                    {genre.text}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
