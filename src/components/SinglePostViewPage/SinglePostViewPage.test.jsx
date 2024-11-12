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

window.alert = jest.fn();


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

test("renders edit button for post owner and toggles edit mode", async () => {
  // Mock Firestore document fetch for posting and user profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockPosting,
  }); // First call for the posting

  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockUser,
  }); // Second call for the user profile

  // Render the component
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data
  await waitFor(() => screen.getByText(mockPosting.postingName));

  // Check if "Edit Posting" button is visible for the owner
  expect(screen.getByText("Edit Posting")).toBeInTheDocument();

  // Simulate click on "Edit Posting"
  fireEvent.click(screen.getByText("Edit Posting"));

  // Check if editing mode is activated (i.e., input fields are visible)
  expect(screen.getByText("Posting Name:")).toBeInTheDocument();
  expect(screen.getByText("Description:")).toBeInTheDocument();
});

test("renders delete button for post owner and triggers delete action", async () => {
  // Mock Firestore document fetch for posting and user profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockPosting,
  }); // First call for the posting

  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockUser,
  }); // Second call for the user profile

  // Mock window.confirm
  window.confirm = jest.fn().mockImplementation(() => true);

  // Render the component
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data
  await waitFor(() => screen.getByText(mockPosting.postingName));

  // Check if "Delete Post" button is visible for the owner
  expect(screen.getByText("Delete Post")).toBeInTheDocument();

  // Simulate click on "Delete Post" button
  fireEvent.click(screen.getByText("Delete Post"));

  // Check if the delete confirmation is triggered (mocking window.confirm)
  expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this post?");
});

test("renders purchase button for non-owners and triggers purchase action", async () => {
  // Mock Firestore document fetch for posting
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockPosting,
  });

  // Set up the non-owner user
  const mockNonOwnerUser = { uid: "non-owner-uid", firstName: "Jane", lastName: "Smith" };

  // Temporarily mock auth.currentUser to simulate a different, non-owner UID
  const originalAuthCurrentUser = auth.currentUser;
  auth.currentUser = { uid: "non-owner-uid" }; // This will simulate a different user viewing the post

  // Mock Firestore document fetch for the non-owner's profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockNonOwnerUser,
  });

  // Render the component
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data
  await waitFor(() => screen.getByText(mockPosting.postingName));

  // Check if "Purchase" button is visible for non-owners instead of the "Edit" button
  const purchaseButton = screen.getByRole("button", { name: /Edit/i });
  expect(purchaseButton).toBeInTheDocument();

  // Simulate click on "Purchase" button
  fireEvent.click(purchaseButton);

  // Check if the purchase alert is triggered with the correct message
  expect(window.alert).toHaveBeenCalledWith(`You have purchased: ${mockPosting.postingName}`);

  // Restore the original auth.currentUser mock
  auth.currentUser = originalAuthCurrentUser;
});
