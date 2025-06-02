import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchGenres, setGenre } from '../store/slices/moviesSlice';

const MainLayout: React.FC = () => {
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genres = useAppSelector(state => state.movies.genres);
  const currentGenre = useAppSelector(state => state.movies.currentGenre);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    const genre = searchParams.get("genre");
    if (genre) {
      dispatch(setGenre(genre));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGenresOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenreClick = (genreName: string) => {
    dispatch(setGenre(genreName));
    setIsGenresOpen(false);
    navigate('/?genre=' + encodeURIComponent(genreName));
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Netflix-style header */}
      <header className="fixed top-0 w-full z-50 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
                <Link to="/" className="text-[#edb409] text-3xl font-bold tracking-wider">
                M
              </Link>
              
              {/* Main navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                <Link to="/watchlist" className="text-white hover:text-gray-300">My List</Link>
              </nav>
            </div>

            <div className="flex items-center space-x-6">
              {/* <SearchBar /> */}
              <button className="text-white">Movies</button>
              <div className="relative">
                <button className="text-white relative">
                  <span className="absolute -top-2 -right-2 bg-[#edb409] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
              <button className="bg-yellow-500 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary navigation */}
      <div className="fixed top-16 w-full z-40 bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold text-white">Movies</h1>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsGenresOpen(!isGenresOpen)}
                  className={`px-4 py-2 bg-[#1f1f1f] text-white rounded-md flex items-center space-x-2 transition-colors duration-200 ${
                    isGenresOpen ? 'bg-[#2f2f2f]' : 'hover:bg-[#2f2f2f]'
                  }`}
                >
                  <span className="mr-2">{currentGenre || 'Genres'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transform transition-transform duration-200 ${isGenresOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Genres Dropdown */}
                {isGenresOpen && (
                  <div className="absolute mt-2 w-56 bg-[#1f1f1f] rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto scrollbar-hide">
                    <button
                      onClick={() => {
                        dispatch(setGenre(''));
                        setIsGenresOpen(false);
                        navigate('/');
                      }}                      className={`block w-full text-left px-4 py-2 ${
                        !currentGenre ? 'bg-[#2f2f2f] text-[#edb409]' : 'text-white hover:bg-[#2f2f2f]'
                      } transition-colors duration-200`}
                    >
                      All Genres
                    </button>
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreClick(genre.name)}                        className={`block w-full text-left px-4 py-2 ${
                          currentGenre === genre.name ? 'bg-[#2f2f2f] text-[#edb409]' : 'text-white hover:bg-[#2f2f2f]'
                        } transition-colors duration-200`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          
           
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-40">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
