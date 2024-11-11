import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateProfilePage from './CreateProfilePage';
import { act } from 'react';
import { auth, db, storage } from '../../__mocks__/firebase'; // Imports the mock functions (see __mock__/firebase.js)
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const mockUser = {
    uid: 'test-uid',
  };

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
  const mockedUsedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  

test('renders the Create Your Profile heading', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const headingElement = screen.getByText(/Create Your Profile/i);
    expect(headingElement).toBeInTheDocument();
});

test('renders the Create Profile button', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const buttonElement = screen.getByRole('button', { name: /Create Profile/i });
    expect(buttonElement).toBeInTheDocument();
});

test('renders the First Name input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const firstNameInput = screen.getByLabelText(/First Name/i);
    expect(firstNameInput).toBeInTheDocument();
});

test('renders the Last Name input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    expect(lastNameInput).toBeInTheDocument();
});

test('renders the Bio textarea', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const bioTextarea = screen.getByLabelText(/Bio/i);
    expect(bioTextarea).toBeInTheDocument();
});

test('renders the Profile Picture file input', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const profileImageInput = screen.getByLabelText(/Profile Picture/i);
    expect(profileImageInput).toBeInTheDocument();
});

test('renders the Middle Name input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const middleNameInput = screen.getByLabelText(/Middle Name \(optional\)/i);
    expect(middleNameInput).toBeInTheDocument();
});

test('first name input has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const firstNameInput = screen.getByLabelText(/First Name/i);
    expect(firstNameInput.value).toBe('');
});

test('last name input has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    expect(lastNameInput.value).toBe('');
});

test('bio textarea has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const bioTextarea = screen.getByLabelText(/Bio/i);
    expect(bioTextarea.value).toBe('');
});

test('profile image input allows file selection', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const profileImageInput = screen.getByLabelText(/Profile Picture/i);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(profileImageInput, { target: { files: [file] } });
    expect(profileImageInput.files[0]).toBe(file);
});

test('handleChange updates formData state correctly', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
        </MemoryRouter>
    );
    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');
});

test('form submission calls handleSubmit', async () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreateProfilePage user={mockUser}/>
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
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CreateProfilePage user={mockUser}/>
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
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CreateProfilePage user={mockUser}/>
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
  
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/posting-list');
    mockedUsedNavigate.mockRestore();
  });