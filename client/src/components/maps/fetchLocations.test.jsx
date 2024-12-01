import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPostNearby from "./SearchPostNearby";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";
import * as fetchLocationsModule from "./fetchLocations";
import * as locationModule from './locationUtils';
import { fetchLocations } from "./fetchLocations";
import { collection, getDocs, query } from "firebase/firestore";

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

describe("fetchLocations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch locations successfully with documents", async () => {
    const mockDocs = [
      { id: "1", data: () => ({ name: "Location 1" }) },
      { id: "2", data: () => ({ name: "Location 2" }) },
    ];
    const mockQuerySnapshot = {
      empty: false,
      docs: mockDocs,
    };

    collection.mockReturnValue("mockCollection");
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const locations = await fetchLocations();

    expect(collection).toHaveBeenCalledWith(expect.anything(), "locations");
    expect(getDocs).toHaveBeenCalledWith("mockCollection");
    expect(locations).toEqual([
      { id: "1", name: "Location 1" },
      { id: "2", name: "Location 2" },
    ]);
  });

  test("should return an empty array when no documents are found", async () => {
    const mockQuerySnapshot = {
      empty: true,
      docs: [],
    };

    collection.mockReturnValue("mockCollection");
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const locations = await fetchLocations();

    expect(collection).toHaveBeenCalledWith(expect.anything(), "locations");
    expect(getDocs).toHaveBeenCalledWith("mockCollection");
    expect(locations).toEqual([]);
  });

  test("should handle errors during fetch", async () => {
    const mockError = new Error("Fetch error");

    collection.mockReturnValue("mockCollection");
    getDocs.mockRejectedValue(mockError);

    const locations = await fetchLocations();

    expect(collection).toHaveBeenCalledWith(expect.anything(), "locations");
    expect(getDocs).toHaveBeenCalledWith("mockCollection");
    expect(locations).toEqual([]);
  });
});