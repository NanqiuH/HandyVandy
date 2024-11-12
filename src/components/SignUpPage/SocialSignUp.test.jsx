import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SocialSignUp from './SocialSignUp';

describe('SocialSignUp Component', () => {
  test('renders social sign-up button', () => {
    render(<SocialSignUp />);
    
    // Check if the button is rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('socialLoginButton');
  });

  test('renders Google icon with correct attributes', () => {
    render(<SocialSignUp />);
    
    // Check if the Google icon image is displayed with correct src and class
    const googleIcon = screen.getByAltText('');
    expect(googleIcon).toBeInTheDocument();
    expect(googleIcon).toHaveAttribute('src', 'google.png');
    expect(googleIcon).toHaveClass('googleIcon');
  });
  

  test('renders text "SignUp with Google"', () => {
    render(<SocialSignUp />);
    
    // Check if the text "SignUp with Google" is displayed
    const buttonText = screen.getByText('SignUp with Google');
    expect(buttonText).toBeInTheDocument();
    expect(buttonText).toHaveClass('socialLoginText');
  });
});
