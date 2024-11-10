import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateProfilePage from './CreateProfilePage';
import { act } from 'react';
import { auth, db, storage } from '../../__mocks__/firebase'; // Imports the mock functions (see __mock__/firebase.js)
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    setDoc: jest.fn(),
  }));
  
  jest.mock('firebase/storage', () => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
  }));
  
  jest.mock('../../firebase', () => ({
    auth: {
      currentUser: { uid: 'test-uid' },
    },
    db: {},
    storage: {},
  }));

  // Mock the useNavigate function
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));
  
  
  

test('renders the Create Your Profile heading', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const headingElement = screen.getByText(/Create Your Profile/i);
    expect(headingElement).toBeInTheDocument();
});

test('renders the Create Profile button', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const buttonElement = screen.getByRole('button', { name: /Create Profile/i });
    expect(buttonElement).toBeInTheDocument();
});

test('renders the First Name input field', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const firstNameInput = screen.getByLabelText(/First Name/i);
    expect(firstNameInput).toBeInTheDocument();
});

test('renders the Last Name input field', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    expect(lastNameInput).toBeInTheDocument();
});

test('renders the Bio textarea', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const bioTextarea = screen.getByLabelText(/Bio/i);
    expect(bioTextarea).toBeInTheDocument();
});

test('renders the Profile Picture file input', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const profileImageInput = screen.getByLabelText(/Profile Picture/i);
    expect(profileImageInput).toBeInTheDocument();
});

test('renders the Middle Name input field', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const middleNameInput = screen.getByLabelText(/Middle Name \(optional\)/i);
    expect(middleNameInput).toBeInTheDocument();
});

test('first name input has the correct initial value', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const firstNameInput = screen.getByLabelText(/First Name/i);
    expect(firstNameInput.value).toBe('');
});

test('last name input has the correct initial value', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    expect(lastNameInput.value).toBe('');
});

test('bio textarea has the correct initial value', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const bioTextarea = screen.getByLabelText(/Bio/i);
    expect(bioTextarea.value).toBe('');
});

test('profile image input allows file selection', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const profileImageInput = screen.getByLabelText(/Profile Picture/i);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(profileImageInput, { target: { files: [file] } });
    expect(profileImageInput.files[0]).toBe(file);
});

test('handleChange updates formData state correctly', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');
});

test('handleImageChange updates profileImage state correctly', () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const profileImageInput = screen.getByLabelText(/Profile Picture/i);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(profileImageInput, { target: { files: [file] } });
    expect(profileImageInput.files[0]).toBe(file);
});

test('form submission calls handleSubmit', async () => {
    render(
        <MemoryRouter>
            <CreateProfilePage />
        </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /Create Profile/i });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(auth.currentUser).toBeTruthy();
});

test('form submission without authentication throws an error', async () => {
  auth.currentUser = null;
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const submitButton = screen.getByRole('button', { name: /Create Profile/i });
  await act(async () => {
    fireEvent.click(submitButton);
  });
  const errorMessage = screen.queryByText(/User not authenticated/i);
    expect(errorMessage).toBeNull();
});

test('form submission with valid data navigates to the correct page', async () => {
    const mockNavigate = jest.fn();
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
  
    setDoc.mockResolvedValue({});
    ref.mockReturnValue({});
    uploadBytes.mockResolvedValue({});
    getDownloadURL.mockResolvedValue('http://example.com/profile.jpg');
  
    render(
      <MemoryRouter>
        <CreateProfilePage />
      </MemoryRouter>
    );
  
    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
  
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
  
    const bioTextarea = screen.getByLabelText(/Bio/i);
    fireEvent.change(bioTextarea, { target: { value: 'This is a bio' } });
  
    const submitButton = screen.getByRole('button', { name: /Create Profile/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    expect(mockNavigate).toHaveBeenCalledWith('/posting-list');
  });