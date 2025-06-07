import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../../type/types';

interface ThemeState {
  theme: Theme;
}

const getInitialTheme = (): Theme => {
  try {
    const savedTheme = localStorage.getItem('movieExplorerTheme') as Theme;
    return savedTheme || 'dark';
  } catch {
    return 'dark';
  }
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('movieExplorerTheme', state.theme);
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      try {
        localStorage.setItem('movieExplorerTheme', state.theme);
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;