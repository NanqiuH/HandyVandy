import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPostNearby from "./SearchPostNearby";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";
import { fetchLocations } from "./SearchPostNearby";
import React from "react";

const mockUser = {
  uid: "test-uid",
};

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
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

test("renders SearchPostNearby component", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SearchPostNearby />
    </MemoryRouter>
  );
  expect(
    screen.getByText("Select a location from map to show in a list")
  ).toBeInTheDocument();
});

test("should set the current user on mount", async () => {
    render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <SearchPostNearby />
        </MemoryRouter>
      );
  await waitFor(() => {
    expect(auth.currentUser).toBeTruthy();
  });
});

test('should fetch locations on mount', async () => {
    const fetchLocations = jest.fn();

    render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <SearchPostNearby fetchLocations={fetchLocations}/>
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(fetchLocations).toHaveBeenCalled();
      });
  });

