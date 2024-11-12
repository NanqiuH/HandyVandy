import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Header', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      user: { uid: 'test-uid' },
      profileImage: 'test-profile-image.png',
      logout: mockLogout,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders header with user logged in', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getAllByAltText('HandyVandy Logo').length).toBeGreaterThan(0);
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  test('renders header with user logged out', () => {
    useAuth.mockReturnValue({
      user: null,
      profileImage: null,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('navigates to home on logo click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByAltText('HandyVandy Logo')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to search post nearby on button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByAltText('location'));
    expect(mockNavigate).toHaveBeenCalledWith('/search-post-nearby');
  });

  test('navigates to chat on button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByAltText('chat'));
    expect(mockNavigate).toHaveBeenCalledWith('/chat/:id');
  });

  test('navigates to posting list on button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByAltText('category'));
    expect(mockNavigate).toHaveBeenCalledWith('/posting-list');
  });

  test('navigates to create posting on button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByAltText('createPost'));
    expect(mockNavigate).toHaveBeenCalledWith('/create-posting');
  });

  test('navigates to profile list on button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByAltText('usericon'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile-list');
  });

  test('logs out and navigates to home on sign out click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Sign Out'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to profile on profile image click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByAltText('Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/test-uid');
  });

  test('navigates to signup on button click', () => {
    useAuth.mockReturnValue({
      user: null,
      profileImage: null,
      logout: mockLogout,
    });
  
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });
  
  test('navigates to login on button click', () => {
    useAuth.mockReturnValue({
      user: null,
      profileImage: null,
      logout: mockLogout,
    });
  
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('Login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
