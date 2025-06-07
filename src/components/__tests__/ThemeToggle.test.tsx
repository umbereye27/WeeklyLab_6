import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThemeToggle from '../ThemeToggle';
import themeReducer from '../../store/slices/themeSlice';

const createTestStore = (theme = 'dark') => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState: {
      theme: { theme },
    },
  });
};

const renderWithStore = (component: React.ReactElement, store = createTestStore()) => {
  return render(<Provider store={store}>{component}</Provider>);
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle button', () => {
    renderWithStore(<ThemeToggle />);
    
    const button = screen.getByTestId('theme-toggle');
    expect(button).toBeInTheDocument();
  });

  it('shows moon icon in light theme', () => {
    const lightStore = createTestStore('light');
    renderWithStore(<ThemeToggle />, lightStore);
    
    const button = screen.getByLabelText(/switch to dark mode/i);
    expect(button).toBeInTheDocument();
  });

  it('shows sun icon in dark theme', () => {
    const darkStore = createTestStore('dark');
    renderWithStore(<ThemeToggle />, darkStore);
    
    const button = screen.getByLabelText(/switch to light mode/i);
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    const store = createTestStore('dark');
    renderWithStore(<ThemeToggle />, store);
    
    const button = screen.getByTestId('theme-toggle');
    await user.click(button);
    
    // Check if the theme changed in the store
    const state = store.getState();
    expect(state.theme.theme).toBe('light');
  });

  it('saves theme to localStorage when toggled', async () => {
    const user = userEvent.setup();
    const store = createTestStore('dark');
    renderWithStore(<ThemeToggle />, store);
    
    const button = screen.getByTestId('theme-toggle');
    await user.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('movieExplorerTheme', 'light');
  });

  it('applies correct styles for light theme', () => {
    const lightStore = createTestStore('light');
    renderWithStore(<ThemeToggle />, lightStore);
    
    const button = screen.getByTestId('theme-toggle');
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-800');
  });

  it('applies correct styles for dark theme', () => {
    const darkStore = createTestStore('dark');
    renderWithStore(<ThemeToggle />, darkStore);
    
    const button = screen.getByTestId('theme-toggle');
    expect(button).toHaveClass('bg-gray-700');
    expect(button).toHaveClass('text-yellow-400');
  });
});