import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpForm from './SignUpForm';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('../../firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('SignUpForm Component', () => {
  const navigate = useNavigate();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<SignUpForm />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  test('shows error alert when fields are empty', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<SignUpForm />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    expect(window.alert).toHaveBeenCalledWith('Email, password, and password confirmation cannot be empty.');
  });

  test('shows error alert when password is less than 6 characters', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<SignUpForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    expect(window.alert).toHaveBeenCalledWith('Password must be greater than or equal 6 characters.');
  });

  test('shows error alert when passwords do not match', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<SignUpForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '654321' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match.');
  });

  test('calls Firebase createUserWithEmailAndPassword with correct values', async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({});
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', '123456');
    });
    expect(navigate).toHaveBeenCalledWith('/create-profile');
  });

  test('shows error alert when email is already in use', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('This email is already in use.');
    });
  });

  test('shows generic error alert when user creation fails', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('User creation failed.'));
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('User creation failed. Please check your email and password.');
    });
  });

  test('toggles password visibility when clicking the visibility icon', () => {
    render(<SignUpForm />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getAllByRole('button')[1]; // Assuming the IconButton is the second button
    
    // Initially, password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
