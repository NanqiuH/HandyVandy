import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
