import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';
import dotenv from 'dotenv';
import '@testing-library/jest-dom';

// Mock Firebase services
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  auth: {
    currentUser: { uid: 'test-uid' },
  },
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  db: jest.fn(),
}));

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({
    onMessage: jest.fn(),
    getToken: jest.fn(),
  })),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  storage: jest.fn(),
}));

// Mock the useAuth function to return a default value
jest.mock('./context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'testUser' },
    profileImage: 'testImageURL',
    logout: jest.fn(),
  }),
}));

dotenv.config({ path: '.env.local' });

// Mock global objects needed for some tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
