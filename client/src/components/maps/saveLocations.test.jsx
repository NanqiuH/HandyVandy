import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPostNearby from "./SearchPostNearby";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";
import { fetchLocations } from "./fetchLocations";
import { saveLocation } from "./saveLocations";
import { collection, getDocs, query, addDoc } from "firebase/firestore";

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

jest.mock("./fetchLocations", () => ({
    fetchLocations: jest.fn(),
}));

describe('saveLocation', () => {
    const selectedLocation = { name: 'Test Location' };
    const setListOfLocations = jest.fn();
    const setShowDialog = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls addDoc with correct parameters', async () => {
        collection.mockReturnValue('mockCollection');
        await saveLocation(selectedLocation, setListOfLocations, setShowDialog);
        expect(addDoc).toHaveBeenCalledWith('mockCollection', selectedLocation);
    });

    test('fetches locations and updates list', async () => {
        const mockLocations = [{ name: 'Location 1' }, { name: 'Location 2' }];
        fetchLocations.mockResolvedValue(mockLocations);
        await saveLocation(selectedLocation, setListOfLocations, setShowDialog);
        expect(fetchLocations).toHaveBeenCalled();
        expect(setListOfLocations).toHaveBeenCalledWith(mockLocations);
    });

    test('sets show dialog to false', async () => {
        await saveLocation(selectedLocation, setListOfLocations, setShowDialog);
        expect(setShowDialog).toHaveBeenCalledWith(false);
    });

    test('handles error case', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        addDoc.mockRejectedValue(new Error('Test Error'));
        await saveLocation(selectedLocation, setListOfLocations, setShowDialog);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding document: ', expect.any(Error));
        consoleErrorSpy.mockRestore();
    });
});