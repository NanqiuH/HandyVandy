// src/tests/CreateProfilePage.test.js

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateProfilePage from '../components/CreateProfilePage/CreateProfilePage';

test('renders the Create Your Profile heading', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const headingElement = screen.getByText(/Create Your Profile/i);
  expect(headingElement).toBeInTheDocument();
});
