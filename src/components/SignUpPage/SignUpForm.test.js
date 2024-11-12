import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('SignUpForm Component', () => {
  const mockNavigate = useNavigate();

  beforeEach(() => {
    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );
  });

  test('renders email, password, and confirm password fields', () => {
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    const toggleButton = screen.getAllByRole('button')[0]; // First toggle button
    const passwordInput = screen.getByPlaceholderText('Password');

    // Initially, password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows alert when fields are empty on submit', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(screen.getByText('Sign Up'));
    expect(window.alert).toHaveBeenCalledWith('Email, password, and password confirmation cannot be empty.');
  });

  test('shows alert when password is too short', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    expect(window.alert).toHaveBeenCalledWith('Password must be greater than or equal 6 characters.');
  });

  test('shows alert when passwords do not match', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '654321' } });
    fireEvent.click(screen.getByText('Sign Up'));

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match.');
  });

  test('calls createUserWithEmailAndPassword on valid form submission and navigates on success', async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({});

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', '123456');
      expect(mockNavigate).toHaveBeenCalledWith('/create-profile');
    });
  });

  test('shows alert if email is already in use', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('This email is already in use.');
    });
  });

  test('shows alert on general error during submission', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Unknown error'));

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('User creation failed. Please check your email and password.');
    });
  });
});
