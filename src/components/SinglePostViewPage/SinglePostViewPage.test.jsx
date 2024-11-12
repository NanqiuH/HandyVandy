import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SinglePostingPage from "./SinglePostViewPage";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";
import { getDoc, updateDoc } from "firebase/firestore";

// Mock user data
const mockUser = {
  uid: "test-uid",
  firstName: "John",
  lastName: "Doe",
};

// Mock posting data
const mockPostingOwner = {
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

const mockPostingNonOwner = {
  postingName: "Test Posting",
  description: "This is a test description",
  price: "20.00",
  serviceType: "offering",
  category: "Tutoring",
  postingUID: "test-uid-non",
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
    data: () => mockPostingOwner,
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
  await waitFor(() => screen.getByText(mockPostingOwner.postingName));

  // Check if posting data is rendered
  expect(screen.getByText(mockPostingOwner.postingName)).toBeInTheDocument();
  expect(screen.getByText(mockPostingOwner.description)).toBeInTheDocument();
  expect(screen.getByText(`Price: $${mockPostingOwner.price}`)).toBeInTheDocument();
  expect(screen.getByText(`Category: ${mockPostingOwner.category}`)).toBeInTheDocument();
  expect(screen.getByText(`Posted by: ${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument();
});

test("renders edit button for post owner and toggles edit mode", async () => {
  // Mock Firestore document fetch for posting and user profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockPostingOwner,
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
  await waitFor(() => screen.getByText(mockPostingOwner.postingName));

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
    data: () => mockPostingOwner,
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
  await waitFor(() => screen.getByText(mockPostingOwner.postingName));

  // Check if "Delete Post" button is visible for the owner
  expect(screen.getByText("Delete Post")).toBeInTheDocument();

  // Simulate click on "Delete Post" button
  fireEvent.click(screen.getByText("Delete Post"));

  // Check if the delete confirmation is triggered (mocking window.confirm)
  expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this post?");
});

test("renders purchase button for non-owners and triggers purchase action", async () => {
  // Mock posting data for a non-owner
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockPostingNonOwner,
  });

  // Mock user as non-owner
  const originalAuthCurrentUser = auth.currentUser;
  auth.currentUser = { uid: mockUser.uid };

  // Mock Firestore fetch for the user's profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockUser,
  });

  // Mock alert for purchase confirmation
  window.alert = jest.fn();

  // Render the component
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for the posting data to appear
  await waitFor(() => screen.getByText(mockPostingNonOwner.postingName));

  // Ensure the "Purchase" button is displayed
  const purchaseButton = screen.getByRole("button", { name: /Purchase/i });
  expect(purchaseButton).toBeInTheDocument();

  // Ensure the "Edit" button is not displayed
  expect(screen.queryByRole("button", { name: /Edit/i })).not.toBeInTheDocument();

  // Simulate clicking the "Purchase" button
  fireEvent.click(purchaseButton);

  // Check for the correct alert message
  expect(window.alert).toHaveBeenCalledWith(
    `You have purchased: ${mockPostingNonOwner.postingName}`
  );

  // Restore original auth.currentUser
  auth.currentUser = originalAuthCurrentUser;
});

test("displays loading message and error if posting fetch fails", async () => {
  getDoc.mockRejectedValueOnce(new Error("Failed to load posting."));
  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/Failed to load posting/)).toBeInTheDocument();
  });
});

test("saves changes after editing a posting", async () => {
  // Mock Firestore data retrieval for the posting and user profile
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  // Render the component
  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for the posting data to load
  await waitFor(() => screen.getByText(mockPostingOwner.postingName));

  // Enable edit mode by clicking "Edit Posting"
  fireEvent.click(screen.getByText("Edit Posting"));

  // Change the posting name and description fields
  fireEvent.change(screen.getByPlaceholderText("Posting Name"), { target: { value: "Updated Posting" } });
  fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Updated description" } });

  // Click "Save Changes" to submit the updates
  fireEvent.click(screen.getByText("Save Changes"));

  // Verify that the updated values are displayed in the UI
  await waitFor(() => {
    expect(screen.getByText("Updated Posting")).toBeInTheDocument();
    expect(screen.getByText("Updated description")).toBeInTheDocument();
    expect(screen.getByText("Price: $20.00")).toBeInTheDocument();
    expect(screen.getByText("Category: Tutoring")).toBeInTheDocument();
  });
});

test("uploads new image and updates posting on save", async () => {
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText(mockPostingOwner.postingName));
  fireEvent.click(screen.getByText("Edit Posting"));

  // Simulate image file upload
  const file = new File(["dummy content"], "new-image.jpg", { type: "image/jpg" });
  const imageInput = screen.getByLabelText("Change Image:");
  userEvent.upload(imageInput, file);

  fireEvent.click(screen.getByText("Save Changes"));

  await waitFor(() => {
    expect(uploadBytes).toHaveBeenCalledWith(expect.anything(), file);
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      postingImageUrl: "https://example.com/new-image.jpg",
    }));
  });
});

test("cancels edit mode without saving changes", async () => {
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText(mockPostingOwner.postingName));
  fireEvent.click(screen.getByText("Edit Posting"));

  // Change the posting name and description
  fireEvent.change(screen.getByLabelText("Posting Name:"), { target: { value: "Changed Posting" } });
  fireEvent.change(screen.getByLabelText("Description:"), { target: { value: "Changed description" } });

  // Click "Cancel" or close edit mode without saving
  fireEvent.click(screen.getByText("Edit Posting"));

  // Ensure updateDoc was not called, meaning changes weren't saved
  expect(updateDoc).not.toHaveBeenCalled();
  expect(screen.getByText(mockPostingOwner.description)).toBeInTheDocument();
});

test("navigates to chat with posting owner when 'Message' button is clicked", async () => {
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText(mockPostingOwner.postingName));

  // Simulate clicking the "Message" button
  fireEvent.click(screen.getByText(`Message ${mockUser.firstName} ${mockUser.lastName}`));

  // Ensure navigation to the chat page
  expect(mockedUsedNavigate).toHaveBeenCalledWith(`/chat/${mockPostingOwner.postingUID}`);
});

test("displays purchase and message buttons for non-owner", async () => {
  // Mock getDoc to return posting data for non-owner scenario
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingNonOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for the posting data to load
  await waitFor(() => screen.getByText(mockPostingNonOwner.postingName));

  // Ensure the "Edit" and "Delete" buttons are not visible to non-owner
  expect(screen.queryByText("Edit Posting")).not.toBeInTheDocument();
  expect(screen.queryByText("Delete Post")).not.toBeInTheDocument();

  // Check that "Purchase" and "Message" buttons are visible for non-owner
  expect(screen.getByRole("button", { name: /Purchase/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Message/i })).toBeInTheDocument();
});

test("non-owner can initiate purchase of the posting", async () => {
  // Mock getDoc to return posting data for non-owner scenario
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingNonOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  // Mock alert function
  window.alert = jest.fn();

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load
  await waitFor(() => screen.getByText(mockPostingNonOwner.postingName));

  // Click "Purchase" button and verify alert
  fireEvent.click(screen.getByRole("button", { name: /Purchase/i }));
  expect(window.alert).toHaveBeenCalledWith(`You have purchased: ${mockPostingNonOwner.postingName}`);
});

test("non-owner can message the posting owner", async () => {
  // Mock getDoc to return posting data for non-owner scenario
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingNonOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load
  await waitFor(() => screen.getByText(mockPostingNonOwner.postingName));

  // Click "Message" button to navigate to chat with posting owner
  fireEvent.click(screen.getByRole("button", { name: /Message/i }));

  // Verify navigation to chat with posting owner
  expect(mockedUsedNavigate).toHaveBeenCalledWith(`/chat/${mockPostingNonOwner.postingUID}`);
});

test("displays correct posting information for non-owner", async () => {
  // Mock getDoc to return posting data for non-owner scenario
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingNonOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load
  await waitFor(() => screen.getByText(mockPostingNonOwner.postingName));

  // Check posting information displayed for non-owner
  expect(screen.getByText(mockPostingNonOwner.postingName)).toBeInTheDocument();
  expect(screen.getByText(mockPostingNonOwner.description)).toBeInTheDocument();
  expect(screen.getByText("Price: $15.00")).toBeInTheDocument();
  expect(screen.getByText("Category: Tutoring")).toBeInTheDocument();
  expect(screen.getByText("Posted by: John Doe")).toBeInTheDocument();
});

test("displays loading state initially", async () => {
  // Mock getDoc to delay resolution
  getDoc.mockImplementationOnce(
    () => new Promise((resolve) => setTimeout(() => resolve({ exists: () => true, data: () => mockPostingNonOwner }), 100))
  );

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Check for loading state before data loads
  expect(screen.getByText(/Loading.../)).toBeInTheDocument();

  // Wait for loading state to disappear
  await waitFor(() => {
    expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument();
  });
});

test("displays error message when posting data fails to load", async () => {
  // Mock Firestore to simulate a data fetch error
  getDoc.mockRejectedValueOnce(new Error("Failed to load posting data"));

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for error message to appear
  await waitFor(() => {
    expect(screen.getByText(/Failed to load posting./)).toBeInTheDocument();
  });
});

test("prevents non-owner from entering edit mode", async () => {
  // Mock Firestore to load posting data as non-owner
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingNonOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  // Mock alert to check for edit prevention message
  window.alert = jest.fn();

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load
  await waitFor(() => screen.getByText(mockPostingNonOwner.postingName));

  // Attempt to toggle edit mode as non-owner
  fireEvent.click(screen.getByText("Edit Posting"));

  // Verify alert shows restriction message for non-owner
  expect(window.alert).toHaveBeenCalledWith("You can only edit your own posting.");
});

test("displays default image if postingImageUrl is missing", async () => {
  // Remove postingImageUrl from mock data to simulate missing field
  const mockPostingWithoutImage = { ...mockPostingNonOwner };
  delete mockPostingWithoutImage.postingImageUrl;

  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingWithoutImage });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load and verify default image is displayed
  await waitFor(() => {
    const defaultImage = screen.getByAltText(mockPostingNonOwner.postingName);
    expect(defaultImage.src).toContain("HandyVandyLogo.png"); // Assuming HandyVandyLogo is the default
  });
});

test("displays 'N/A' for missing category", async () => {
  // Remove category from mock data to simulate missing field
  const mockPostingWithoutCategory = { ...mockPostingNonOwner };
  delete mockPostingWithoutCategory.category;

  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingWithoutCategory });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load and check if 'N/A' is displayed for category
  await waitFor(() => {
    expect(screen.getByText("Category: N/A")).toBeInTheDocument();
  });
});

test("displays last updated timestamp if available", async () => {
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingNonOwner });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load and check for last updated timestamp
  await waitFor(() => {
    expect(screen.getByText(/Last updated on:/)).toBeInTheDocument();
    expect(screen.getByText(/11\/11\/2024, 6:00:00 AM/)).toBeInTheDocument(); // Adjust format if necessary
  });
});

test("displays only created date if updatedAt is missing", async () => {
  // Remove updatedAt from mock data to simulate missing field
  const mockPostingWithoutUpdatedAt = { ...mockPostingNonOwner };
  delete mockPostingWithoutUpdatedAt.updatedAt;

  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockPostingWithoutUpdatedAt });
  getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUser });

  render(
    <MemoryRouter>
      <SinglePostingPage />
    </MemoryRouter>
  );

  // Wait for posting data to load and check for created date only
  await waitFor(() => {
    expect(screen.getByText(/Posted on:/)).toBeInTheDocument();
    expect(screen.queryByText(/Last updated on:/)).not.toBeInTheDocument();
  });
});
