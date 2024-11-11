import { onAuthStateChanged } from "firebase/auth";

// Mocking Firebase functions used in the component
export const getAuth = jest.fn();
export const getFirestore = jest.fn();
export const getMessaging = jest.fn(() => ({
  onMessage: jest.fn(),
  getToken: jest.fn(),
}));
export const getStorage = jest.fn();

// Mocking the Firebase Auth module
export const auth = {
  currentUser: { uid: 'test-uid' }, // Simulating a logged-in user
  onAuthStateChanged: jest.fn(), // Mocking the onAuthStateChanged method
};

// Mocking Firestore
export const db = {
  setDoc: jest.fn(), // Mocking Firestore setDoc method (used for writing to Firestore)
};

// Mocking Firebase Storage
export const storage = {
  uploadBytes: jest.fn(), // Mocking Firebase uploadBytes method (used for uploading files)
  getDownloadURL: jest.fn().mockResolvedValue('https://fakeurl.com/profile.jpg'), // Mocking the method to get download URL for a file
};

// Mocking Firestore document reference (if you use doc() in your component)
export const doc = jest.fn(() => ({
  set: jest.fn(),
}));
