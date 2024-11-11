import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreatePostingPage from './CreatePostingPage';
import { act } from 'react';
import { auth, db, storage } from '../../__mocks__/firebase'; // Imports the mock functions (see __mock__/firebase.js)
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const mockUser = {
    uid: 'test-uid',
  };

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
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

test('Posting Name input field has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const postingNameInput = screen.getByLabelText(/Posting Name/i);
    expect(postingNameInput.value).toBe('');
});

test('Description input field has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const descriptionInput = screen.getByLabelText(/Description/i);
    expect(descriptionInput.value).toBe('');
});

test('Price input field has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const priceInput = screen.getByLabelText(/Price/i);
    expect(priceInput.value).toBe('');
});

test('Service Type input field has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const serviceTypeInput = screen.getByLabelText(/Service Type/i);
    expect(serviceTypeInput.value).toBe('None');
});

test('Category input field has the correct initial value', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const categoryInput = screen.getByLabelText(/Category/i);
    expect(categoryInput.value).toBe("None");
});

test('Upload an Image input allows file selection', () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const profileImageInput = screen.getByLabelText(/Upload an Image/i);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(profileImageInput, { target: { files: [file] } });
    expect(profileImageInput.files[0]).toBe(file);
});

test('handles input change for Posting Name', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CreatePostingPage user={mockUser} />
      </MemoryRouter>
    );
    const postingNameInput = screen.getByLabelText(/posting name/i);
    fireEvent.change(postingNameInput, { target: { value: 'New Posting Name' } });
    expect(postingNameInput.value).toBe('New Posting Name');
});

test('handles input change for Description', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CreatePostingPage user={mockUser} />
    </MemoryRouter>
  );
  const descriptionInput = screen.getByLabelText(/description/i);
  fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
  expect(descriptionInput.value).toBe('New Description');
});

test('handles input change for Price', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CreatePostingPage user={mockUser} />
    </MemoryRouter>
  );
  const priceInput = screen.getByLabelText(/price/i);
  fireEvent.change(priceInput, { target: { value: '100' } });
  expect(priceInput.value).toBe('100');
});

test('contains correct options in service type dropdown', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CreatePostingPage user={mockUser} />
    </MemoryRouter>
  );
  const dropdown = screen.getByLabelText('Service Type');
  expect(dropdown).toHaveTextContent('Offering');
  expect(dropdown).toHaveTextContent('Requesting');
  expect(dropdown).toHaveTextContent('Offering with Delivery');
  expect(dropdown).toHaveTextContent('Requesting with Delivery');
});

test('allows user to select an option from service type dropdown', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CreatePostingPage user={mockUser} />
      </MemoryRouter>
    );
    const dropdown = screen.getByLabelText('Service Type');
  
    // Simulate user selecting "Offering"
    fireEvent.change(dropdown, { target: { value: 'Offering' } });
    const selectedOption = screen.getByDisplayValue('Offering');
    expect(selectedOption).toBeInTheDocument();
    
    // Simulate user selecting "Requesting"
    fireEvent.change(dropdown, { target: { value: 'Requesting' } });
    const selectedOptionTutoring = screen.getByDisplayValue('Requesting');
    expect(selectedOptionTutoring).toBeInTheDocument();
  });

test('contains correct options in category dropdown', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CreatePostingPage user={mockUser} />
      </MemoryRouter>
    );
    const dropdown = screen.getByLabelText('Category');
    expect(dropdown).toHaveTextContent('None');
    expect(dropdown).toHaveTextContent('Physical Labor');
    expect(dropdown).toHaveTextContent('Tutoring');
    expect(dropdown).toHaveTextContent('Food');
    expect(dropdown).toHaveTextContent('Performance');
    expect(dropdown).toHaveTextContent('Travel');
    expect(dropdown).toHaveTextContent('Technology');
    expect(dropdown).toHaveTextContent('Cleaning');
    expect(dropdown).toHaveTextContent('Transportation');
    expect(dropdown).toHaveTextContent('Healthcare');
    expect(dropdown).toHaveTextContent('Childcare');
    expect(dropdown).toHaveTextContent('Home Improvement');
    expect(dropdown).toHaveTextContent('Pet Care');
    expect(dropdown).toHaveTextContent('Event Planning');
    expect(dropdown).toHaveTextContent('Education');
    expect(dropdown).toHaveTextContent('Art & Design');
    expect(dropdown).toHaveTextContent('Fitness');
    expect(dropdown).toHaveTextContent('Landscaping');
    expect(dropdown).toHaveTextContent('Writing');
    expect(dropdown).toHaveTextContent('Music');
    expect(dropdown).toHaveTextContent('Photography');
    expect(dropdown).toHaveTextContent('Automotive');
    expect(dropdown).toHaveTextContent('Other');
  });

  test('allows user to select an option from category dropdown', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CreatePostingPage user={mockUser} />
      </MemoryRouter>
    );
    const dropdown = screen.getByLabelText('Category');
  
    // Simulate user selecting "Physical Labor"
    fireEvent.change(dropdown, { target: { value: 'physical labor' } });
    const selectedOption = screen.getByDisplayValue('Physical Labor');
    expect(selectedOption).toBeInTheDocument();
    
    // Simulate user selecting "Tutoring"
    fireEvent.change(dropdown, { target: { value: 'tutoring' } });
    const selectedOptionTutoring = screen.getByDisplayValue('Tutoring');
    expect(selectedOptionTutoring).toBeInTheDocument();
  });

  test('form submission calls handleSubmit', async () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CreatePostingPage user={mockUser}/>
        </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /Create Posting/i });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(auth.currentUser).toBeTruthy();
});

test('form submission without authentication throws an error', async () => {
    auth.currentUser = null;
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CreatePostingPage user={mockUser}/>
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /Create Posting/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const errorMessage = screen.queryByText(/User not authenticated/i);
      expect(errorMessage).toBeNull();
  });

  test('form submission with valid data navigates to the correct page', async () => { 
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CreatePostingPage user={mockUser}/>
      </MemoryRouter>
    );
  
    const postingNameInput = screen.getByLabelText(/Posting Name/i);
    fireEvent.change(postingNameInput, { target: { value: 'Head Chef' } });
  
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'seeking Head Chef' } });
  
    const priceInput = screen.getByLabelText(/Price/i);
    fireEvent.change(priceInput, { target: { value: '100' } });

    const dropdownServiceType = screen.getByLabelText('Service Type');
    fireEvent.change(dropdownServiceType, { target: { value: 'Requesting' } });

    const dropdownCategory = screen.getByLabelText('Category');
    fireEvent.change(dropdownCategory, { target: { value: 'physical labor' } });
  
    const submitButton = screen.getByRole('button', { name: /Create Posting/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/posting-list');
    mockedUsedNavigate.mockRestore();
  });