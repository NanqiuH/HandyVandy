// src/__mocks__/AuthContext.js
export const useAuth = jest.fn(() => ({
    user: { uid: 'test-uid' },
    profileImage: 'http://example.com/profile.jpg',
    logout: jest.fn(),
  }));