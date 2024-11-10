import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
});
