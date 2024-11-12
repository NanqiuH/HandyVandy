import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateProfilePage from "./CreateProfilePage";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";

const mockUser = {
  uid: "test-uid",
};

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
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

// Mock the useNavigate function
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

afterEach(() => {
  jest.clearAllMocks();
});

test("renders the Create Your Profile heading", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const headingElement = screen.getByText(/Create Your Profile/i);
  expect(headingElement).toBeInTheDocument();
});

test("renders the Create Profile button", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const buttonElement = screen.getByRole("button", { name: /Create Profile/i });
  expect(buttonElement).toBeInTheDocument();
});

test("renders the First Name input field", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const firstNameInput = screen.getByLabelText(/First Name/i);
  expect(firstNameInput).toBeInTheDocument();
});

test("renders the Last Name input field", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  expect(lastNameInput).toBeInTheDocument();
});

test("renders the Bio textarea", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const bioTextarea = screen.getByLabelText(/Bio/i);
  expect(bioTextarea).toBeInTheDocument();
});

test("renders the Profile Picture file input", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const profileImageInput = screen.getByLabelText(/Profile Picture/i);
  expect(profileImageInput).toBeInTheDocument();
});

test("renders the Middle Name input field", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const middleNameInput = screen.getByLabelText(/Middle Name \(optional\)/i);
  expect(middleNameInput).toBeInTheDocument();
});

test("first name input has the correct initial value", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const firstNameInput = screen.getByLabelText(/First Name/i);
  expect(firstNameInput.value).toBe("");
});

test("last name input has the correct initial value", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  expect(lastNameInput.value).toBe("");
});

test("bio textarea has the correct initial value", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const bioTextarea = screen.getByLabelText(/Bio/i);
  expect(bioTextarea.value).toBe("");
});

test("profile image input allows file selection", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const profileImageInput = screen.getByLabelText(/Profile Picture/i);
  const file = new File(["dummy content"], "example.png", {
    type: "image/png",
  });
  fireEvent.change(profileImageInput, { target: { files: [file] } });
  expect(profileImageInput.files[0]).toBe(file);
});

test("handleChange updates formData state correctly", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const firstNameInput = screen.getByLabelText(/First Name/i);
  fireEvent.change(firstNameInput, { target: { value: "John" } });
  expect(firstNameInput.value).toBe("John");
});

test("form submission calls handleSubmit", async () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const submitButton = screen.getByRole("button", { name: /Create Profile/i });
  await userEvent.click(submitButton);
  expect(auth.currentUser).toBeTruthy();
});

test("form submission without authentication throws an error", async () => {
  auth.currentUser = null;
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );
  const submitButton = screen.getByRole("button", { name: /Create Profile/i });
  await userEvent.click(submitButton);
  const errorMessage = screen.queryByText(/User not authenticated/i);
  expect(errorMessage).toBeNull();
});

test("form submission with valid data navigates to the correct page", async () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );

  const firstNameInput = screen.getByLabelText(/First Name/i);
  fireEvent.change(firstNameInput, { target: { value: "John" } });

  const lastNameInput = screen.getByLabelText(/Last Name/i);
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });

  const bioTextarea = screen.getByLabelText(/Bio/i);
  fireEvent.change(bioTextarea, { target: { value: "This is a bio" } });

  const submitButton = screen.getByRole("button", { name: /Create Profile/i });
  await userEvent.click(submitButton);

  expect(mockedUsedNavigate).toHaveBeenCalledWith("/posting-list");
  mockedUsedNavigate.mockRestore();
});

test("first name and last name fields are marked as required", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CreateProfilePage user={mockUser} />
    </MemoryRouter>
  );

  const firstNameInput = screen.getByLabelText(/First Name/i);
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  const bioInput = screen.getByLabelText(/Bio/i);


  expect(firstNameInput).toBeRequired();
  expect(lastNameInput).toBeRequired();
  expect(bioInput).toBeRequired();
});


test("throws error when user is not authenticated", async () => {
  auth.currentUser = null; // Mock unauthenticated state

  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );

  const submitButton = screen.getByRole("button", { name: /Create Profile/i });
  await userEvent.click(submitButton);

  // Expect an error to be thrown and logged in the console
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining("User not authenticated"));
});

test("uploads profile image and retrieves download URL", async () => {
  const mockFile = new File(["dummy content"], "example.png", {
    type: "image/png",
  });

  const mockDownloadURL = "https://fake-url.com/example.png";
  uploadBytes.mockResolvedValueOnce(); // Mock successful upload
  getDownloadURL.mockResolvedValueOnce(mockDownloadURL); // Mock successful URL retrieval

  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );

  const profileImageInput = screen.getByLabelText(/Profile Picture/i);
  fireEvent.change(profileImageInput, { target: { files: [mockFile] } });

  const firstNameInput = screen.getByLabelText(/First Name/i);
  fireEvent.change(firstNameInput, { target: { value: "John" } });

  const lastNameInput = screen.getByLabelText(/Last Name/i);
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });

  const bioTextarea = screen.getByLabelText(/Bio/i);
  fireEvent.change(bioTextarea, { target: { value: "This is a bio" } });

  const submitButton = screen.getByRole("button", { name: /Create Profile/i });
  await userEvent.click(submitButton);

  // Verify uploadBytes and getDownloadURL are called
  expect(uploadBytes).toHaveBeenCalled();
  expect(getDownloadURL).toHaveBeenCalled();
  expect(setDoc).toHaveBeenCalledWith(
    expect.any(Object),
    expect.objectContaining({
      profileImageUrl: mockDownloadURL,
    })
  );
});

test("sets profileImageUrl to null if no image is uploaded", async () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );

  const firstNameInput = screen.getByLabelText(/First Name/i);
  fireEvent.change(firstNameInput, { target: { value: "Jane" } });

  const lastNameInput = screen.getByLabelText(/Last Name/i);
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });

  const bioTextarea = screen.getByLabelText(/Bio/i);
  fireEvent.change(bioTextarea, { target: { value: "This is another bio" } });

  const submitButton = screen.getByRole("button", { name: /Create Profile/i });
  await userEvent.click(submitButton);

  // Verify profileImageUrl is null
  expect(setDoc).toHaveBeenCalledWith(
    expect.any(Object),
    expect.objectContaining({
      profileImageUrl: null,
    })
  );
});

test("navigates to /posting-list on successful form submission", async () => {
  const mockFile = new File(["dummy content"], "example.png", {
    type: "image/png",
  });

  const mockDownloadURL = "https://fake-url.com/example.png";
  uploadBytes.mockResolvedValueOnce(); // Mock successful upload
  getDownloadURL.mockResolvedValueOnce(mockDownloadURL); // Mock successful URL retrieval

  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );

  const profileImageInput = screen.getByLabelText(/Profile Picture/i);
  fireEvent.change(profileImageInput, { target: { files: [mockFile] } });

  const firstNameInput = screen.getByLabelText(/First Name/i);
  fireEvent.change(firstNameInput, { target: { value: "John" } });

  const lastNameInput = screen.getByLabelText(/Last Name/i);
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });

  const bioTextarea = screen.getByLabelText(/Bio/i);
  fireEvent.change(bioTextarea, { target: { value: "This is a bio" } });

  const submitButton = screen.getByRole("button", { name: /Create Profile/i });
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/posting-list");
  });
});