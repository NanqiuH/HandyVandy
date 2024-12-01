import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

afterEach(() => {
  jest.clearAllMocks();
});

test('renders without crashing', () => {
  render(<App />);
});
