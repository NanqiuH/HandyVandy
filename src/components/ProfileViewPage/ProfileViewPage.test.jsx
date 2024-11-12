import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProfileViewPage from "./ProfileViewPage";
import { getDoc, updateDoc } from "firebase/firestore";
import { auth } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

// Mock Firestore and Storage functions
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock("../../firebase", () => ({
  auth: {
    currentUser: { uid: "test-uid" },
  },
  db: {},
  storage: {},
}));

// Mock Navigation
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

afterEach(() => {
  jest.clearAllMocks();
});

// Tests for ProfileViewPage

test("renders ProfileViewPage with mock data", async () => {
    // Mock Firestore document fetch for profile
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockUser,
    });
  
    // Render ProfileViewPage with MemoryRouter and correct route setup
    render(
      <MemoryRouter
        initialEntries={["/profile/test-uid"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Wait for profile bio to appear in the document
    await waitFor(() => screen.getByText(mockUser.bio));
  
    // Verify profile data is rendered correctly
    expect(screen.getByText(mockUser.firstName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.middleName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.lastName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
  });
  

test("renders edit button for profile owner and toggles edit mode", async () => {
  // Mock Firestore document fetch for profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockUser,
  });

  // Render the ProfileViewPage component
  render(
    <MemoryRouter
      initialEntries={["/profile/test-uid"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/profile/:id" element={<ProfileViewPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for profile data to load
  await waitFor(() => screen.getByText(mockUser.bio));

  // Check if "Edit Profile" button is visible for the owner
  const editButton = screen.getByText("Edit Profile");
  expect(editButton).toBeInTheDocument();

  // Simulate click on "Edit Profile"
  fireEvent.click(editButton);

  // Check if editing mode is activated (input fields are visible)
  expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
});

test("allows profile image upload for profile owner", async () => {
  // Mock Firestore document fetch for profile
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => mockUser,
  });

  getDownloadURL.mockResolvedValue("https://example.com/updated_profile_image.png");

  // Render the ProfileViewPage component
  render(
    <MemoryRouter
      initialEntries={["/profile/test-uid"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/profile/:id" element={<ProfileViewPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for profile data
  await waitFor(() => screen.getByText(mockUser.bio));

  // Click "Edit Profile" to enter edit mode
  fireEvent.click(screen.getByText("Edit Profile"));

  // Simulate file upload
  const file = new File(["new_image"], "profile.png", { type: "image/png" });
  const fileInput = screen.getByLabelText(/Profile Image/i);
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Simulate click on "Save Changes"
  const saveButton = screen.getByText("Save Changes");
  fireEvent.click(saveButton);

  // Verify uploadBytes and updateDoc are called
  await waitFor(() => expect(uploadBytes).toHaveBeenCalled());
  await waitFor(() => expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
    profileImageUrl: "https://example.com/updated_profile_image.png",
  }));
});

test("shows error message when profile not found", async () => {
  // Mock Firestore to return non-existent profile
  getDoc.mockResolvedValueOnce({ exists: () => false });

  // Render ProfileViewPage component
  render(
    <MemoryRouter
      initialEntries={["/profile/non-existent-id"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/profile/:id" element={<ProfileViewPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Verify error message appears when profile is not found
  const errorMessage = await screen.findByText("Profile not found.");
  expect(errorMessage).toBeInTheDocument();
});
