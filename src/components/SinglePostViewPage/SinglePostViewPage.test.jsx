import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SinglePostingPage from "./SinglePostViewPage";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";
import { getDoc } from "firebase/firestore";

// Mock user data
const mockUser = {
  uid: "test-uid",
  firstName: "John",
  lastName: "Doe",
};

// Mock posting data
const mockPosting = {
  postingName: "Test Posting",
  description: "This is a test description",
  price: "20.00",
  serviceType: "offering",
  category: "Tutoring",
  postingUID: "test-uid",
  postingImageUrl: "https://example.com/image.jpg",
  createdAt: "2024-11-11T10:00:00Z",
  updatedAt: "2024-11-11T12:00:00Z",
};

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

// Mock Firebase Storage functions
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock Firebase auth
jest.mock("../../firebase", () => ({
  auth: {
    currentUser: { uid: "test-uid" },
  },
  db: {},
  storage: {},
}));

// Mock the useNavigate function
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

afterEach(() => {
  jest.clearAllMocks();
});

// Test with mock data
test("renders SinglePostingPage with mock data", async () => {
  // Mock Firestore document fetch for posting and user profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockPosting,
  }); // First call for the posting

  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockUser,
  }); // Second call for the user profile

  // Render the component with mock data
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for the posting data to appear in the document
  await waitFor(() => screen.getByText(mockPosting.postingName));

  // Check if posting data is rendered
  expect(screen.getByText(mockPosting.postingName)).toBeInTheDocument();
  expect(screen.getByText(mockPosting.description)).toBeInTheDocument();
  expect(screen.getByText(`Price: $${mockPosting.price}`)).toBeInTheDocument();
  expect(screen.getByText(`Category: ${mockPosting.category}`)).toBeInTheDocument();
  expect(screen.getByText(`Posted by: ${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument();
});
