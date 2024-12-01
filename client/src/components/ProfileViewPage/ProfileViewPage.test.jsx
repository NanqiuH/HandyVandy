import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProfileViewPage from "./ProfileViewPage";
import { getDoc, getDocs, doc, collection, query, where } from "firebase/firestore";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)

// Mock user and profile data
const mockUser = {
  uid: "test-uid",
  firstName: "John",
  middleName: "A",
  lastName: "Doe",
  bio: "Software Engineer",
  profileImageUrl: "https://example.com/john.png",
  rating: 4,
  posts: [{ id: "1", title: "Service A", price: 50 }],
};

const updatedData = {
  bio: "Software Engineer",
  firstName: "John",
  lastName: "Doe",
  middleName: "A",
  numRatings: 1,
  profileImageUrl: "https://example.com/john.png",
  rating: 5,
};

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

// Mock Firebase Storage functions
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock Firebase
jest.mock("../../firebase", () => ({
  auth: {
    currentUser: { uid: "test-uid" },
  },
  db: {} // Mocking the db object
}));

// Mock the useNavigate function
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));


window.alert = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

test("renders profile view page", async () => {
  // Create a mock document reference (profileRef)
  const mockDocRef = { id: mockUser.uid };

  // Mock Firestore doc function to return the mock reference
  doc.mockReturnValue(mockDocRef);  // Ensure it returns the mock document reference

  // Mock Firestore document snapshot (profileSnap)
  const mockProfileSnap = {
    exists: jest.fn().mockReturnValue(true),  // Mock exists method to return true
    data: jest.fn().mockReturnValue(mockUser),  // Mock data method to return the mock user
    id: mockUser.uid,
    ref: mockDocRef,  // Mock the reference for the document
    _document: {
      key: {
        path: `profiles/${mockUser.uid}`,  // Mimic the document path
      },
    },
  };

  getDoc.mockReturnValue(mockProfileSnap);

  const mockReviewData = [{ id: "1", text: "Great profile!", rating: 5 }];
  
  const mockReviewsSnapshot = {
    docs: mockReviewData.map(data => ({
      data: jest.fn().mockReturnValue(data),  // Mock the data method to return review data
    })),
  };

  // Mock query-related functions
  query.mockReturnValue("mocked-query");  // Mock the query function to return a string (or any mock value)
  collection.mockReturnValue("mocked-collection");
  where.mockReturnValue("mocked-where");

  // Mock the getDocs function to resolve with the mock reviews snapshot
  getDocs.mockResolvedValueOnce(mockReviewsSnapshot);

  
  // Mock Firebase auth currentUser
  const originalAuthCurrentUser = auth.currentUser;
  auth.currentUser = { uid: mockUser.uid };

  // Render the component
  render(
    <MemoryRouter initialEntries={[`/profile/${mockUser.uid}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProfileViewPage />
    </MemoryRouter>
  );

  // Check if profile details are rendered
  await waitFor(() =>
    screen.getByText(`${mockUser.firstName} ${mockUser.middleName} ${mockUser.lastName}`)
  );
  expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
  expect(screen.getByAltText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument();
  // Restore original auth.currentUser
  auth.currentUser = originalAuthCurrentUser;
});

test("navigates to review creation page when clicking 'Leave a Review' button", async () => {
  // Mock the Firestore document reference (profileRef) for the user profile
  const mockDocRef = { id: "123" };

  // Mock Firestore doc function to return the mock reference
  doc.mockReturnValue(mockDocRef);

  // Mock Firestore document snapshot (profileSnap)
  const mockProfileSnap = {
    exists: jest.fn().mockReturnValue(true),  // Mock exists method to return true
    data: jest.fn().mockReturnValue({
      firstName: "John",
      middleName: "Doe",
      lastName: "Smith",
      bio: "This is a sample bio.",
      profileImageUrl: "sample-image-url",
      rating: 4.5,
      posts: [{ id: "1", title: "Sample Post", price: 10 }],
    }),  // Mock data method to return the mock user
    id: "123",  // Mock user ID
    ref: mockDocRef,  // Mock the reference for the document
  };

  // Mock Firestore getDoc function to return the mock profile snapshot
  getDoc.mockReturnValue(mockProfileSnap);

  // Mock the reviews data
  const mockReviewData = [{ id: "1", text: "Great profile!", rating: 5 }];
  const mockReviewsSnapshot = {
    docs: mockReviewData.map(data => ({
      data: jest.fn().mockReturnValue(data),  // Mock the data method to return review data
    })),
  };

  // Mock the getDocs function to resolve with the mock reviews snapshot
  getDocs.mockResolvedValueOnce(mockReviewsSnapshot);

  // Mock Firebase auth currentUser
  const originalAuthCurrentUser = auth.currentUser;
  auth.currentUser = { uid: "you" };

  // Render the ProfileViewPage component
  render(
    <MemoryRouter
      initialEntries={["/profile/123"]}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/profile/:id" element={<ProfileViewPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Check if the profile details are rendered
  await waitFor(() =>
    screen.getByText("John Doe Smith")  // Check that full name is rendered
  );
  expect(screen.getByText("This is a sample bio.")).toBeInTheDocument();  // Check if bio is displayed

  // Check if 'Leave a Review' button is present
  const leaveReviewButton = screen.getByText("Leave a Review");
  expect(leaveReviewButton).toBeInTheDocument();

  // Mock the navigate function and simulate clicking the 'Leave a Review' button
  fireEvent.click(leaveReviewButton);

  // Check if navigation occurred to the correct review page
  expect(mockedUsedNavigate).toHaveBeenCalledWith("/review/123", {
    state: { revieweeId: "123", revieweeName: "John Smith" },
  });
  mockedUsedNavigate.mockRestore();

  // Restore the original auth.currentUser
  auth.currentUser = originalAuthCurrentUser;
});

test("displays error message when profile does not exist", async () => {
  getDoc.mockResolvedValueOnce({
    exists: jest.fn().mockReturnValue(false),
  });

  render(
    <MemoryRouter
      initialEntries={["/profile/123"]}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/profile/:id" element={<ProfileViewPage />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText("Failed to load profile."));
  expect(screen.getByText("Failed to load profile.")).toBeInTheDocument();
});

test("allows profile editing when user is the owner", async () => {
    // Mock the Firestore document reference (profileRef) for the user profile
    const mockDocRef = { id: "123" };
  
    // Mock Firestore doc function to return the mock reference
    doc.mockReturnValue(mockDocRef);
  
    // Mock Firestore document snapshot (profileSnap)
    const mockProfileSnap = {
      exists: jest.fn().mockReturnValue(true),  // Mock exists method to return true
      data: jest.fn().mockReturnValue({
        firstName: "John",
        middleName: "Doe",
        lastName: "Smith",
        bio: "This is a sample bio.",
        profileImageUrl: "sample-image-url",
        rating: 4.5,
        posts: [{ id: "1", title: "Sample Post", price: 10 }],
      }),  // Mock data method to return the mock user
      id: "123",  // Mock user ID
      ref: mockDocRef,  // Mock the reference for the document
    };
  
    // Mock Firestore getDoc function to return the mock profile snapshot
    getDoc.mockReturnValue(mockProfileSnap);
  
    // Mock the reviews data
    const mockReviewData = [{ id: "1", text: "Great profile!", rating: 5 }];
    const mockReviewsSnapshot = {
      docs: mockReviewData.map(data => ({
        data: jest.fn().mockReturnValue(data),  // Mock the data method to return review data
      })),
    };
  
    // Mock the getDocs function to resolve with the mock reviews snapshot
    getDocs.mockResolvedValueOnce(mockReviewsSnapshot);
  
    // Mock Firebase auth currentUser
    const originalAuthCurrentUser = auth.currentUser;
    auth.currentUser = { uid: "123" };
  
    // Render the ProfileViewPage component
    render(
      <MemoryRouter
        initialEntries={["/profile/123"]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Check if the profile details are rendered
    await waitFor(() =>
      screen.getByText("John Doe Smith")  // Check that full name is rendered
    );
    expect(screen.getByText("This is a sample bio.")).toBeInTheDocument();  // Check if bio is displayed
  
    // Check if 'Leave a Review' button is present
    const editButton = screen.getByText("Edit Profile");
    expect(editButton).toBeInTheDocument();
  
    fireEvent.click(editButton);
  
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/edit/123", {
      state: { revieweeId: "123", revieweeName: "John Smith" },
    });
    mockedUsedNavigate.mockRestore();
  
    // Restore the original auth.currentUser
    auth.currentUser = originalAuthCurrentUser;
  });


test("prevents profile editing for non-owners", async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue(mockUser),
    });
  
    auth.currentUser = { uid: "non-owner-id" }; // Set the current user to someone else
  
    render(
      <MemoryRouter initialEntries={[`/profile/${mockUser.uid}`]}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    
  
    
   
  
    
  });
  
test("renders reviews with correct data", async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue(mockUser),
    });
  
    const mockReviewData = [
      { id: "1", rating: 5, comment: "Excellent!", createdAt: new Date().toISOString(), reviewerName: "Alice" },
      { id: "2", rating: 4, comment: "Good job!", createdAt: new Date().toISOString(), reviewerName: "Bob" },
    ];
  
    getDocs.mockResolvedValueOnce({
      docs: mockReviewData.map((review) => ({
        id: review.id,
        data: () => review,
      })),
    });
  
    render(
      <MemoryRouter initialEntries={[`/profile/${mockUser.uid}`]}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    
  });
  
test("renders 'Send Message' and 'Leave a Review' buttons for non-owners", async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue(mockUser),
    });
  
    auth.currentUser = { uid: "non-owner-id" }; // Set current user to a non-owner
  
    render(
      <MemoryRouter initialEntries={[`/profile/${mockUser.uid}`]}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    
  });

test("renders 'Edit Profile' button for owners only", async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue(mockUser),
    });
  
    auth.currentUser = { uid: mockUser.uid }; // Set current user as the owner
  
    render(
      <MemoryRouter initialEntries={[`/profile/${mockUser.uid}`]}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    
  
    
  });
  
  jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  db: {},
  storage: {},
  auth: {
    currentUser: { uid: 'testUserId' },
  },
}));

describe('ProfileViewPage', () => {
  const mockProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'M',
    bio: 'This is a test bio.',
    profileImageUrl: 'testProfileImage.png',
    rating: 4.5,
  };

  const mockReviews = [
    {
      id: 'review1',
      rating: 5,
      comment: 'Great service!',
      createdAt: new Date().toISOString(),
      reviewerName: 'Alice',
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockProfileData });
    getDocs.mockResolvedValueOnce({
      docs: mockReviews.map((review) => ({ id: review.id, data: () => review })),
    });
  });

  test('renders profile information and reviews correctly', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockProfileData });
    getDocs.mockResolvedValueOnce({
      docs: mockReviews.map((review) => ({ id: review.id, data: () => review })),
    });

    render(
      <MemoryRouter initialEntries={['/profile/testUserId']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John M Doe')).toBeInTheDocument();
      expect(screen.getByText('This is a test bio.')).toBeInTheDocument();
      expect(screen.getByText('Great service!')).toBeInTheDocument();
    });
    
  });

  test('toggles edit mode and updates input values', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockProfileData });
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(
      <MemoryRouter initialEntries={['/profile/testUserId']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

    expect(firstNameInput.value).toBe('Jane');
  });

  test('saves changes and calls updateDoc', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockProfileData });
    getDocs.mockResolvedValueOnce({ docs: [] });
    

    render(
      <MemoryRouter initialEntries={['/profile/testUserId']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Profile'));
    });

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.click(screen.getByText('Save Changes'));

  });

  test('displays error message if profile data fails to load', async () => {
    getDoc.mockRejectedValueOnce(new Error('Failed to load profile'));

    render(
      <MemoryRouter initialEntries={['/profile/testUserId']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load profile.')).toBeInTheDocument();
    });
  });

  test('handles image upload and updates profileImageUrl', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockProfileData });
    getDocs.mockResolvedValueOnce({ docs: [] });
 

    render(
      <MemoryRouter initialEntries={['/profile/testUserId']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Profile'));
    });

  
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
   

    fireEvent.click(screen.getByText('Save Changes'));

    
  });

  test('navigates to chat page when Send Message button is clicked', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockProfileData });
    getDocs.mockResolvedValueOnce({ docs: [] });
    
    render(
      <MemoryRouter initialEntries={['/profile/testUserId']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
          <Route path="/chat/:id" element={<div>Chat Page</div>} />
        </Routes>
      </MemoryRouter>
    );

  
  });
});
