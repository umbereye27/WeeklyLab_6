import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/slices/themeSlice';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-md transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          : 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
      }`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      data-testid="theme-toggle"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;