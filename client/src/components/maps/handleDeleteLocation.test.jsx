import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPostNearby from "./SearchPostNearby";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import { handleDeleteLocation } from "./handleDeleteLocation";
import { fetchLocations } from "./fetchLocations";
import { collection, getDocs, query, doc, deleteDoc } from "firebase/firestore";

const mockUser = {
  uid: "test-uid",
};

jest.mock("./fetchLocations", () => ({
    fetchLocations: jest.fn(),
}));

jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    ...originalModule,
    collection: jest.fn(),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
    deleteDoc: jest.fn().mockResolvedValue(undefined),
    doc: jest.fn().mockReturnValue({ id: "loc123", path: "locations/loc123" }),
  };
});

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

describe('handleDeleteLocation', () => {
  const mockSetListOfLocations = jest.fn();
  const mockUser = { uid: 'user123' };
  const mockLocation = { id: 'loc123', userId: 'user123' };

  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn();
    global.alert = jest.fn();
  });

  test('deletes location when user confirms and has permission', async () => {
    global.confirm.mockReturnValue(true);
    fetchLocations.mockResolvedValue([{ id: 'loc456' }]);

    await handleDeleteLocation(mockLocation, mockUser, mockSetListOfLocations);

    expect(doc).toHaveBeenCalledWith({}, 'locations', 'loc123');
    expect(deleteDoc).toHaveBeenCalledWith({ id: 'loc123' });
    expect(fetchLocations).toHaveBeenCalled();
    expect(mockSetListOfLocations).toHaveBeenCalledWith([{ id: 'loc456' }]);
  });

  test('does not delete location when user does not have permission', async () => {
    global.confirm.mockReturnValue(true);
    const anotherUser = { uid: 'user456' };

    await handleDeleteLocation(mockLocation, anotherUser, mockSetListOfLocations);

    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(fetchLocations).not.toHaveBeenCalled();
    expect(mockSetListOfLocations).not.toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith('You do not have permission to delete this location.');
  });

  test('does not delete location when user cancels', async () => {
    global.confirm.mockReturnValue(false);

    await handleDeleteLocation(mockLocation, mockUser, mockSetListOfLocations);

    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(fetchLocations).not.toHaveBeenCalled();
    expect(mockSetListOfLocations).not.toHaveBeenCalled();
  });

  test('handles error during deletion', async () => {
    global.confirm.mockReturnValue(true);
    deleteDoc.mockRejectedValue(new Error('Deletion failed'));

    await handleDeleteLocation(mockLocation, mockUser, mockSetListOfLocations);

    expect(doc).toHaveBeenCalledWith({}, 'locations', 'loc123');
    expect(deleteDoc).toHaveBeenCalledWith({ id: 'loc123' });
    expect(fetchLocations).not.toHaveBeenCalled();
    expect(mockSetListOfLocations).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error deleting document: ', expect.any(Error));
  });
});