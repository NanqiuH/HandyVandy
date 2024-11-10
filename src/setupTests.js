import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';
import dotenv from 'dotenv';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';
import '@testing-library/jest-dom'; // Add this line for Jest DOM matchers

// Mock each Firebase function that initializes services in your app
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
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

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
