import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreatePostingPage from './CreatePostingPage';
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
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));
  
  

test('renders CreatePostingPage without crashing', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage />
        </MemoryRouter>
    );
    expect(screen.getByText(/Create Posting/i)).toBeInTheDocument();
});

test('renders the Create a New Posting heading', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage />
        </MemoryRouter>
    );
    const headingElement = screen.getByText(/Create a New Posting/i);
    expect(headingElement).toBeInTheDocument();
});

test('renders the Create Posting button', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const buttonElement = screen.getByRole('button', { name: /Create Posting/i });
    expect(buttonElement).toBeInTheDocument();
});

test('renders the Posting Name input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const postingNameInput = screen.getByLabelText(/Posting Name/i);
    expect(postingNameInput).toBeInTheDocument();
});

test('renders the Description input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const descriptionInput = screen.getByLabelText(/Description/i);
    expect(descriptionInput).toBeInTheDocument();
});

test('renders the Price input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const priceInput = screen.getByLabelText(/Price/i);
    expect(priceInput).toBeInTheDocument();
});

test('renders the Service Type input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const serviceTypeInput = screen.getByLabelText(/Service Type/i);
    expect(serviceTypeInput).toBeInTheDocument();
});

test('renders the Category input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const categoryInput = screen.getByLabelText(/Category/i);
    expect(categoryInput).toBeInTheDocument();
});

test('renders the Upload an Image input field', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const ImageInput = screen.getByLabelText(/Upload an Image/i);
    expect(ImageInput).toBeInTheDocument();
});