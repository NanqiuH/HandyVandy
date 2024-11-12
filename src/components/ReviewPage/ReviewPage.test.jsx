import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ReviewPage from "./ReviewPage";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";
import { addDoc, updateDoc, getDoc } from "firebase/firestore";

const mockUser = {
  uid: "test-uid",
};

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
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

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

test("should render review form correctly", () => {
    render(
        <MemoryRouter initialEntries={[{ pathname: "/review", state: { revieweeId: "testRevieweeId" } }]}>
          <ReviewPage />
        </MemoryRouter>
      );
  expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Submit Review/i })).toBeInTheDocument();
});

test("should submit review when all fields are filled", async () => {
    render(
        <MemoryRouter initialEntries={[{ pathname: "/review", state: { revieweeId: "testRevieweeId" } }]}>
          <ReviewPage />
        </MemoryRouter>
      );

  const ratingInput = screen.getByLabelText(/Rating/i);
  fireEvent.change(ratingInput, { target: { value: "4" } });

  const commentInput = screen.getByLabelText(/Comment/i);
  fireEvent.change(commentInput, { target: { value: "Great service!" } });

  const submitButton = screen.getByRole("button", { name: /Submit Review/i });
  await userEvent.click(submitButton);
});

test("should show authentication error when user is not logged in", async () => {
  auth.currentUser = null;

  render(
    <MemoryRouter initialEntries={[{ pathname: "/review", state: { revieweeId: "testRevieweeId" } }]}>
      <ReviewPage />
    </MemoryRouter>
  );

  const ratingInput = screen.getByLabelText(/Rating/i);
  fireEvent.change(ratingInput, { target: { value: "5" } });

  const commentInput = screen.getByLabelText(/Comment/i);
  fireEvent.change(commentInput, { target: { value: "Excellent!" } });

  const submitButton = screen.getByRole("button", { name: /Submit Review/i });
  await userEvent.click(submitButton);

  const errorMessage = screen.queryByText(/User not authenticated/i);
  expect(errorMessage).toBeNull();
});


test("should show error when reviewee profile is not found", async () => {
    getDoc.mockResolvedValue({ exists: () => false });
  
    render(
      <MemoryRouter initialEntries={[{ pathname: "/review", state: { revieweeId: "testRevieweeId" } }]}>
        <ReviewPage />
      </MemoryRouter>
    );
  
    const ratingInput = screen.getByLabelText(/Rating/i);
    fireEvent.change(ratingInput, { target: { value: "5" } });
  
    const commentInput = screen.getByLabelText(/Comment/i);
    fireEvent.change(commentInput, { target: { value: "Excellent!" } });
  
    const submitButton = screen.getByRole("button", { name: /Submit Review/i });
    await userEvent.click(submitButton);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error adding review or updating profile: ",
        expect.any(Error)
      );
    });
  });
  