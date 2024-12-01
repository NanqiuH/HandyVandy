import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatPage from './ChatPage';
import { useParams } from 'react-router-dom';
import { fetchMessages, sendMessage, saveMessagingDeviceToken } from '../../messaging';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MemoryRouter } from 'react-router-dom';




// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../messaging', () => ({
  fetchMessages: jest.fn(),
  sendMessage: jest.fn(),
  saveMessagingDeviceToken: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  auth: {
    currentUser: { uid: 'senderId' },
  },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('ChatPage Component', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: 'receiverId' });
    fetchMessages.mockImplementation((receiverId, senderId, setMessages) => {
      setMessages([
        {
          id: '1',
          senderId: 'senderId',
          text: 'Hello!',
          timestamp: { seconds: 1620000000 },
        },
        {
          id: '2',
          senderId: 'receiverId',
          text: 'Hi!',
          timestamp: { seconds: 1620003600 },
        },
      ]);
      return jest.fn(); // Mock unsubscribe function
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders header and chat elements correctly', () => {
    render(
        <MemoryRouter>
          <ChatPage />
        </MemoryRouter>
      );
    expect(screen.getByRole('heading', { name: /Chat with/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  test('fetches and displays receiver full name', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ firstName: 'John', lastName: 'Doe' }),
    });

    render(
        <MemoryRouter>
          <ChatPage />
        </MemoryRouter>
      );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Chat with John Doe/i })).toBeInTheDocument();
    });
  });

  test('displays messages correctly', () => {
    render(
        <MemoryRouter>
          <ChatPage />
        </MemoryRouter>
      );
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi!')).toBeInTheDocument();
    expect(screen.getByText('You:')).toBeInTheDocument();
  });

  test('formats timestamp correctly', () => {
    // Mock a message with a specific timestamp
    const messages = [
      {
        id: '1',
        senderId: 'user1',
        text: 'Hello!',
        timestamp: { seconds: 1620000000 } // Mock timestamp
      }
    ];
  
    // Mock the ChatPage component to use these messages
    render(
      <MemoryRouter>
        <ChatPage messages={messages} />
      </MemoryRouter>
    );
  
    // Example expected formatted date based on the timestamp
    
  });

  test('handles message input and sending', async () => {
    sendMessage.mockResolvedValueOnce({});
    saveMessagingDeviceToken.mockResolvedValueOnce({});
    
    render(
        <MemoryRouter>
          <ChatPage />
        </MemoryRouter>
      );

    const messageInput = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(messageInput, { target: { value: 'New message' } });
    expect(messageInput).toHaveValue('New message');

    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith('New message', 'senderId', 'receiverId');
      expect(saveMessagingDeviceToken).toHaveBeenCalledWith('senderId');
    });
    expect(messageInput).toHaveValue(''); // Check if input is cleared after sending
  });

  test('handles receiver not found case gracefully', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    render(
        <MemoryRouter>
          <ChatPage />
        </MemoryRouter>
      );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Chat with User/i })).toBeInTheDocument();
    });
  });

  test('logs error when fetching user details fails', async () => {
    console.error = jest.fn();
    getDoc.mockRejectedValueOnce(new Error('Failed to fetch user'));

    render(
        <MemoryRouter>
          <ChatPage />
        </MemoryRouter>
      );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching user details:', expect.any(Error));
    });
  });
});
