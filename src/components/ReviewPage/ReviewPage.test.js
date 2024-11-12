import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/';
import { MemoryRouter } from "react-router-dom";
import ReviewPage from "./ReviewPage";
import { auth, db } from "../../firebase";
import { addDoc } from "firebase/firestore";

// Mock Firebase imports
jest.mock("../../firebase", () => ({
  auth: { currentUser: { uid: "testUserId" } },
  db: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn().mockResolvedValue(true),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe("ReviewPage Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={[{ state: { revieweeId: "testId", revieweeName: "Test Name" } }]}>
        <ReviewPage />
      </MemoryRouter>
    );
  });

  test("renders ReviewPage and form elements", () => {
    expect(screen.getByText(/Leave a Review for Test Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Review/i)).toBeInTheDocument();
  });

  test("displays error message if comment is empty", async () => {
    fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: "5" } });
    fireEvent.submit(screen.getByText(/Submit Review/i));

    expect(screen.getByText(/Please enter a comment./i)).toBeInTheDocument();
  });

  test("successfully submits a valid review", async () => {
    fireEvent.change(screen.getByLabelText(/Comment/i), { target: { value: "Great work!" } });
    fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: "4" } });
    fireEvent.submit(screen.getByText(/Submit Review/i));

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        rating: 4,
        comment: "Great work!",
        reviewerUID: "testUserId",
        revieweeId: "testId",
        revieweeName: "Test Name",
      })
    );
  });
});
