module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.jsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^firebase/app$': '<rootDir>/src/__mocks__/firebase.js',
    '^firebase/auth$': '<rootDir>/src/__mocks__/firebase.js',
    '^firebase/firestore$': '<rootDir>/src/__mocks__/firebase.js',
    '^firebase/messaging$': '<rootDir>/src/__mocks__/firebase.js',
    '^firebase/storage$': '<rootDir>/src/__mocks__/firebase.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};