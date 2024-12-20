import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPostNearby from "./SearchPostNearby";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";
import * as fetchLocationsModule from "./fetchLocations";
import * as locationModule from './locationUtils';
import { fetchLocations } from "./fetchLocations";
import { collection, getDocs, query } from "firebase/firestore";
import React from 'react';
import { db } from '../../firebase';
import { saveLocation } from './saveLocations';
import { handleDeleteLocation } from './handleDeleteLocation';
import { APIProvider } from '@vis.gl/react-google-maps';

const mockUser = {
  uid: "test-uid",
};

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }) => <div>{children}</div>,
  Map: ({ children, onClick }) => (
    <div
      data-testid="map-mock"
      onClick={() =>
        onClick({
          detail: {
            placeId: "some-place-id",
            latLng: { lat: 40.7128, lng: -74.0060 },
          },
        })
      }
    >
      {children}
    </div>
  ),
  Marker: ({ position }) => (
    <div data-testid="marker">
      Marker at {position.lat}, {position.lng}
    </div>
  ),
  InfoWindow: ({ children }) => <div data-testid="info-window">{children}</div>,
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

beforeEach(() => {
  getDocs.mockResolvedValue({
    docs: [
      {
        id: "1",
        data: () => ({
          lat: 36.1420163,
          lng: -86.8038583,
          name: "Test Location",
          userId: "test-user-id",
        }),
      },
    ],
  });
});

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

test("should fetch locations on mount", async () => {
  const fetchLocations = jest.spyOn(fetchLocationsModule, "fetchLocations");

  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SearchPostNearby />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(fetchLocations).toHaveBeenCalled();
  });
});

// test("should fetch locations Name", async () => {
//   const getLocationName = jest.spyOn(locationModule, "getLocationName");

//   render(
//     <MemoryRouter
//       future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//     >
//       <SearchPostNearby />
//     </MemoryRouter>
//   );

//   await waitFor(() => {
//     expect(getLocationName).toHaveBeenCalledWith(36.1420163, -86.8038583);
//   });

//   // Clean up the spy
//   getLocationName.mockRestore();
// });

// test('should handle map click and set location', async () => {
//   // Mock fetchLocations to return a list of locations
//   const mockLocations = [
//     { id: 1, lat: 40.7128, lng: -74.0060 },
//     { id: 2, lat: 34.0522, lng: -118.2437 },
//   ];
//   fetchLocationsModule.fetchLocations.mockResolvedValue(mockLocations);

//   // Mock getLocationName to return a fake location name
//   const getLocationName = jest.spyOn(locationModule, 'getLocationName').mockResolvedValue('Fake Location');

//   const { getByTestId } = render(
//     <MemoryRouter
//       future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//     >
//       <SearchPostNearby />
//     </MemoryRouter>
//   );

//   await waitFor(() => {
//     // Assert that fetchLocations was called
//     expect(fetchLocationsModule.fetchLocations).toHaveBeenCalled();

//     // Assert that the locations are set correctly
//     mockLocations.forEach((location) => {
//       expect(screen.getByText((content, element) => {
//         return element.tagName.toLowerCase() === 'div' && content.includes(`Location ${location.id}`);
//       })).toBeInTheDocument();
//     });
//   });

//   // Simulate a map click event
//   const mapProps = {
//     detail: {
//       placeId: 'somePlaceId',
//       latLng: {
//         lat: 40.7128,
//         lng: -74.0060,
//       },
//     },
//   };

//   // Assuming you have a map element with a data-testid="map"
//   fireEvent.click(getByTestId('map'), mapProps);

//   await waitFor(() => {
//     // Assert that getLocationName was called with the correct coordinates
//     expect(getLocationName).toHaveBeenCalledWith(40.7128, -74.0060);
//   });

//   // Restore the original implementation
//   getLocationName.mockRestore();
// });


jest.mock('../../firebase', () => ({
  auth: { currentUser: { uid: 'testUserId' } },
  db: {},
}));

jest.mock('./fetchLocations', () => ({
  fetchLocations: jest.fn(),
}));

jest.mock('./saveLocations', () => ({
  saveLocation: jest.fn(),
}));

jest.mock('./handleDeleteLocation', () => ({
  handleDeleteLocation: jest.fn(),
}));

jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: jest.fn(({ children }) => <div>{children}</div>),
  Map: jest.fn(({ children }) => <div data-testid="map">{children}</div>),
  Marker: jest.fn(() => <div data-testid="marker"></div>),
  InfoWindow: jest.fn(({ children }) => <div data-testid="info-window">{children}</div>),
}));

describe('SearchPostNearby Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial elements', async () => {
    fetchLocations.mockResolvedValue([]);
    
    render(<SearchPostNearby />);
    
    expect(screen.getByText('Select a location from map to show in a list')).toBeInTheDocument();
  
    
    await waitFor(() => {
      expect(fetchLocations).toHaveBeenCalled();
    });
  });

  test('displays a marker and allows location selection', async () => {
    fetchLocations.mockResolvedValue([{ id: 'loc1', lat: 36.142, lng: -86.803, name: 'Test Location', userId: 'testUserId' }]);
    
    render(<SearchPostNearby />);

    await waitFor(() => {
      expect(screen.getByText('List of Selected Locations')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });
  });

  test('opens dialog when selecting a location on the map', async () => {
    render(<SearchPostNearby />);

    // Simulate map click event that would trigger dialog
    const mapClickHandler = jest.fn((_, setShowDialog, setDialogLocation, setSelectedLocation) => {
      setShowDialog(true);
      setDialogLocation({ lat: 36.142, lng: -86.803 });
      setSelectedLocation({ lat: 36.142, lng: -86.803, name: 'Selected Location', userId: 'testUserId' });
    });
    
    await waitFor(() => {
      mapClickHandler({}, jest.fn(), jest.fn(), jest.fn());
      expect(screen.getByTestId('info-window')).toBeInTheDocument();
      expect(screen.getByText('Do you want to save this location?')).toBeInTheDocument();
    });
  });

  test('calls saveLocation when saving a selected location', async () => {
    render(<SearchPostNearby />);
    
    const mapClickHandler = jest.fn((_, setShowDialog, setDialogLocation, setSelectedLocation) => {
      setShowDialog(true);
      setDialogLocation({ lat: 36.142, lng: -86.803 });
      setSelectedLocation({ lat: 36.142, lng: -86.803, name: 'Selected Location', userId: 'testUserId' });
    });

    // Open the save dialog
    await waitFor(() => {
      mapClickHandler({}, jest.fn(), jest.fn(), jest.fn());
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(saveLocation).toHaveBeenCalledWith(
        { lat: 36.142, lng: -86.803, name: 'Selected Location', userId: 'testUserId' },
        expect.any(Function),
        expect.any(Function)
      );
    });
  });

  test('calls handleDeleteLocation when deleting a location', async () => {
    fetchLocations.mockResolvedValue([{ id: 'loc1', lat: 36.142, lng: -86.803, name: 'Test Location', userId: 'testUserId' }]);
    
    render(<SearchPostNearby />);

    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(handleDeleteLocation).toHaveBeenCalledWith(
        { id: 'loc1', lat: 36.142, lng: -86.803, name: 'Test Location', userId: 'testUserId' },
        { uid: 'testUserId' },
        expect.any(Function)
      );
    });
  });

  test('handles geolocation successfully', async () => {
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

    render(<SearchPostNearby />);

    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });

  test('handles geolocation error', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success, error) =>
        error({ message: 'Geolocation error' })
      ),
    };
    global.navigator.geolocation = mockGeolocation;

    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    render(<SearchPostNearby />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error getting current location:', { message: 'Geolocation error' });
    });

    consoleError.mockRestore();
  });
});
