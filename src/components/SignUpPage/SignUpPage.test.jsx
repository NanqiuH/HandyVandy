import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from './SignUpPage';

// Mock child components to focus on testing SignUpPage behavior
jest.mock('./SignUpForm', () => () => <form role="form">SignUpForm Component</form>);
jest.mock('./SocialSignUp', () => () => <div>SocialSignUp Component</div>);
jest.mock('../Layout/Header', () => () => <header role="banner">Header Component</header>);

describe('SignUpPage Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );
  });



  

  test('renders the hero image with correct attributes', () => {
    // Check if the hero image is displayed with correct src and alt attributes
    const heroImage = screen.getByAltText('HandyVandy illustration');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', 'loginHero.png');
    expect(heroImage).toHaveClass('heroImage');
  });

  test('renders welcome header and title', () => {
    // Check if the welcome message and brand name are displayed
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText('HandyVandy')).toBeInTheDocument();
  });

  test('renders SocialSignUp component', () => {
    // Check if the SocialSignUp component is rendered
    expect(screen.getByText('SocialSignUp Component')).toBeInTheDocument();
  });

  test('renders the divider with text "OR"', () => {
    // Check for the divider line and text
    const dividerText = screen.getByText('OR');
    expect(dividerText).toBeInTheDocument();
    expect(dividerText).toHaveClass('dividerText');
  });

  test('renders SignUpForm component', () => {
    // Check if the SignUpForm component is rendered
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByText('SignUpForm Component')).toBeInTheDocument();
  });
});
