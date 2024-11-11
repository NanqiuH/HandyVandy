import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPostNearBy from "./SearchPostNearby";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";

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

// Mock Google Maps API
jest.mock('@vis.gl/react-google-maps', () => ({
    APIProvider: ({ children }) => <div>{children}</div>,
    Map: ({ children }) => <div>{children}</div>,
    Marker: () => <div>Marker</div>,
    InfoWindow: ({ children }) => <div>{children}</div>,
  }));

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});
// Mock navigator.geolocation
const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      success({
        coords: {
          latitude: 36.1420163,
          longitude: -86.8038583,
        },
      })
    ),
  };

global.navigator.geolocation = mockGeolocation;

test("renders SearchPostBy without crashing", () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <SearchPostNearBy />
      </MemoryRouter>
    );
    expect(screen.getByText("Select a location from map to show in a list")).toBeInTheDocument();
  });

  test("fetches and displays user location", async () => {
    render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <SearchPostNearBy />
        </MemoryRouter>
      );
    await waitFor(() => expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled());
    expect(screen.getByText("Marker")).toBeInTheDocument();
  });

  test("handles map click and shows dialog", async () => {
    render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <SearchPostNearBy />
        </MemoryRouter>
      );
    fireEvent.click(screen.getByText("Marker"));
    expect(screen.getByText("Do you want to save this location?")).toBeInTheDocument();
  });