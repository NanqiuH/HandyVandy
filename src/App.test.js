import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the getMessaging function
jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({
    onMessage: jest.fn(),
    getToken: jest.fn(),
  })),
}));

test('renders without crashing', () => {
  render(<App />);
});
