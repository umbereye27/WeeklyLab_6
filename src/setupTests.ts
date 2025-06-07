import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('./firebase/config', () => ({
  db: {},
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
}));

// Mock environment variables
process.env.VITE_REACT_APP_API_KEY = 'test-api-key';
process.env.VITE_REACT_APP_API_HOST = 'test-api-host';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;