import { fetchMessages, sendMessage, fetchUserDetails, saveMessagingDeviceToken } from './messaging';
import { db, messaging } from './firebase';
import { collection, addDoc, getDoc, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

jest.mock('./firebase', () => ({
  db: {},
  messaging: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('firebase/messaging', () => ({
  getToken: jest.fn(),
  onMessage: jest.fn(),
}));

describe('Messaging Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMessages', () => {
    it('fetches messages between sender and receiver', async () => {
      const setMessages = jest.fn();
      const unsubscribe = jest.fn();
      const receiverId = 'receiverId';
      const senderId = 'senderId';

      // Mock onSnapshot
      onSnapshot.mockImplementation((query, callback) => {
        callback({
          docs: [
            { id: '1', data: () => ({ text: 'Hello', senderId: 'senderId', receiverId: 'receiverId' }) },
            { id: '2', data: () => ({ text: 'Hi', senderId: 'receiverId', receiverId: 'senderId' }) },
          ],
        });
        return unsubscribe;
      });

      const returnedUnsubscribe = fetchMessages(receiverId, senderId, setMessages);

      expect(onSnapshot).toHaveBeenCalled();
      await waitFor(() => {
        expect(setMessages).toHaveBeenCalledWith([
          { id: '1', text: 'Hello', senderId: 'senderId', receiverId: 'receiverId' },
          { id: '2', text: 'Hi', senderId: 'receiverId', receiverId: 'senderId' },
        ]);
      });
      expect(returnedUnsubscribe).toBe(unsubscribe);
    });
  });

  describe('sendMessage', () => {
    it('sends a new message and saves it to Firestore', async () => {
      addDoc.mockResolvedValueOnce({});

      await sendMessage('Hello', 'senderId', 'receiverId');

      expect(addDoc).toHaveBeenCalledWith(collection(db, 'messages'), {
        text: 'Hello',
        senderId: 'senderId',
        receiverId: 'receiverId',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('fetchUserDetails', () => {
    it('fetches user details successfully', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ firstName: 'John', lastName: 'Doe' }),
      });

      const result = await fetchUserDetails('userId');
      expect(getDoc).toHaveBeenCalledWith(doc(db, 'users', 'userId'));
      expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
    });

    it('returns default user if user not found', async () => {
      getDoc.mockResolvedValueOnce({ exists: () => false });

      const result = await fetchUserDetails('userId');
      expect(result).toEqual({ firstName: 'User', lastName: '' });
    });
  });

  describe('saveMessagingDeviceToken', () => {
    it('saves FCM token to Firestore', async () => {
      getToken.mockResolvedValue('mocked-fcm-token');
      setDoc.mockResolvedValueOnce();

      await saveMessagingDeviceToken('userId');

      expect(setDoc).toHaveBeenCalledWith(doc(db, 'fcmTokens', 'userId'), { fcmToken: 'mocked-fcm-token' });
      expect(onMessage).toHaveBeenCalledWith(messaging, expect.any(Function));
    });

    it('requests permission if FCM token is unavailable', async () => {
      getToken.mockResolvedValue(null);
      global.Notification = { requestPermission: jest.fn().mockResolvedValue('granted') };

      await saveMessagingDeviceToken('userId');

      expect(global.Notification.requestPermission).toHaveBeenCalled();
    });
  });
});

describe('Messaging Functions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('fetchMessages', () => {
      it('fetches messages between sender and receiver', async () => {
        const setMessages = jest.fn();
        const unsubscribe = jest.fn();
        const receiverId = 'receiverId';
        const senderId = 'senderId';
  
        // Mock onSnapshot
        onSnapshot.mockImplementation((query, callback) => {
          callback({
            docs: [
              { id: '1', data: () => ({ text: 'Hello', senderId: 'senderId', receiverId: 'receiverId' }) },
              { id: '2', data: () => ({ text: 'Hi', senderId: 'receiverId', receiverId: 'senderId' }) },
            ],
          });
          return unsubscribe;
        });
  
        const returnedUnsubscribe = fetchMessages(receiverId, senderId, setMessages);
  
        expect(onSnapshot).toHaveBeenCalled();
        await waitFor(() => {
          expect(setMessages).toHaveBeenCalledWith([
            { id: '1', text: 'Hello', senderId: 'senderId', receiverId: 'receiverId' },
            { id: '2', text: 'Hi', senderId: 'receiverId', receiverId: 'senderId' },
          ]);
        });
        expect(returnedUnsubscribe).toBe(unsubscribe);
      });
  
      it('handles no messages for sender and receiver', async () => {
        const setMessages = jest.fn();
  
        onSnapshot.mockImplementation((query, callback) => {
          callback({ docs: [] });
        });
  
        fetchMessages('receiverId', 'senderId', setMessages);
  
        expect(onSnapshot).toHaveBeenCalled();
        expect(setMessages).toHaveBeenCalledWith([]);
      });
    });
  
    describe('sendMessage', () => {
      it('sends a new message and saves it to Firestore', async () => {
        addDoc.mockResolvedValueOnce({});
  
        await sendMessage('Hello', 'senderId', 'receiverId');
  
        expect(addDoc).toHaveBeenCalledWith(collection(db, 'messages'), {
          text: 'Hello',
          senderId: 'senderId',
          receiverId: 'receiverId',
          timestamp: expect.any(Date),
        });
      });
  
      it('does not send an empty message', async () => {
        await sendMessage('  ', 'senderId', 'receiverId');
  
        expect(addDoc).not.toHaveBeenCalled();
      });
    });
  
    describe('fetchUserDetails', () => {
      it('fetches user details successfully', async () => {
        getDoc.mockResolvedValueOnce({
          exists: () => true,
          data: () => ({ firstName: 'John', lastName: 'Doe' }),
        });
  
        const result = await fetchUserDetails('userId');
        expect(getDoc).toHaveBeenCalledWith(doc(db, 'users', 'userId'));
        expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
      });
  
      it('returns default user if user not found', async () => {
        getDoc.mockResolvedValueOnce({ exists: () => false });
  
        const result = await fetchUserDetails('userId');
        expect(result).toEqual({ firstName: 'User', lastName: '' });
      });
  
      it('handles error fetching user details', async () => {
        console.error = jest.fn();
        getDoc.mockRejectedValueOnce(new Error('Failed to fetch user'));
  
        const result = await fetchUserDetails('userId');
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        expect(result).toEqual({ firstName: 'User', lastName: '' });
      });
    });
  
    describe('saveMessagingDeviceToken', () => {
      it('saves FCM token to Firestore when token is available', async () => {
        getToken.mockResolvedValue('mocked-fcm-token');
        setDoc.mockResolvedValueOnce();
  
        await saveMessagingDeviceToken('userId');
  
        expect(setDoc).toHaveBeenCalledWith(doc(db, 'fcmTokens', 'userId'), { fcmToken: 'mocked-fcm-token' });
        expect(onMessage).toHaveBeenCalledWith(messaging, expect.any(Function));
      });
  
      it('requests notification permissions if FCM token is unavailable', async () => {
        getToken.mockResolvedValue(null);
        global.Notification = { requestPermission: jest.fn().mockResolvedValue('granted') };
  
        await saveMessagingDeviceToken('userId');
  
        expect(global.Notification.requestPermission).toHaveBeenCalled();
      });
  
      it('handles error when saving FCM token', async () => {
        console.error = jest.fn();
        getToken.mockRejectedValue(new Error('Failed to get token'));
  
        await saveMessagingDeviceToken('userId');
  
        expect(console.error).toHaveBeenCalledWith('Unable to get messaging token.', expect.any(Error));
      });
  
      it('does not proceed if notification permission is denied', async () => {
        getToken.mockResolvedValue(null);
        global.Notification = { requestPermission: jest.fn().mockResolvedValue('denied') };
  
        await saveMessagingDeviceToken('userId');
  
        expect(global.Notification.requestPermission).toHaveBeenCalled();
        expect(setDoc).not.toHaveBeenCalled();
      });
    });
  });

  describe('fetchMessages', () => {
    const setMessages = jest.fn();
    const receiverId = 'receiverId';
    const senderId = 'senderId';
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('fetchMessages listens for message updates and filters messages for sender and receiver', async () => {
      // Mock onSnapshot to simulate Firestore messages collection with documents
      onSnapshot.mockImplementation((query, callback) => {
        callback({
          docs: [
            { id: '1', data: () => ({ text: 'Hello', senderId: 'senderId', receiverId: 'receiverId', timestamp: { seconds: 1620000000 } }) },
            { id: '2', data: () => ({ text: 'Hi', senderId: 'receiverId', receiverId: 'senderId', timestamp: { seconds: 1620003600 } }) },
            { id: '3', data: () => ({ text: 'Not for you', senderId: 'otherUser', receiverId: 'anotherUser', timestamp: { seconds: 1620007200 } }) },
          ],
        });
        return jest.fn(); // Mock unsubscribe function
      });
  
      fetchMessages(receiverId, senderId, setMessages);
  
      expect(onSnapshot).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  
      await waitFor(() => {
        expect(setMessages).toHaveBeenCalledWith([
          { id: '1', text: 'Hello', senderId: 'senderId', receiverId: 'receiverId', timestamp: { seconds: 1620000000 } },
          { id: '2', text: 'Hi', senderId: 'receiverId', receiverId: 'senderId', timestamp: { seconds: 1620003600 } },
        ]);
      });
    });
  
    test('fetchMessages filters out messages that do not match sender or receiver IDs', async () => {
      // Mock onSnapshot to return messages unrelated to the current conversation
      onSnapshot.mockImplementation((query, callback) => {
        callback({
          docs: [
            { id: '1', data: () => ({ text: 'Random Message', senderId: 'user1', receiverId: 'user2', timestamp: { seconds: 1620010800 } }) },
          ],
        });
        return jest.fn(); // Mock unsubscribe function
      });
  
      fetchMessages(receiverId, senderId, setMessages);
  
      await waitFor(() => {
        expect(setMessages).toHaveBeenCalledWith([]);
      });
    });
  
    test('fetchMessages returns unsubscribe function', () => {
      const mockUnsubscribe = jest.fn();
      onSnapshot.mockReturnValue(mockUnsubscribe);
  
      const unsubscribe = fetchMessages(receiverId, senderId, setMessages);
      
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
