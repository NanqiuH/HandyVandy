import { db, messaging } from "./firebase";
import { doc, setDoc, collection, query, orderBy, addDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

export const FCM_TOKEN_COLLECTION = "fcmTokens";
const VAPID_KEY = "BEQFx3BckKgroKNiBuxoGEBUMpzkzols0HkFn7FR_Vst4XF8fhEszkXLJvzYgEBmltxr0NMq7rf"; // Your VAPID Key from Firebase Console

// Fetch messages between sender and receiver, ordered by timestamp
export const fetchMessages = (receiverId, senderId, setMessages) => {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const messagesData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const messageData = doc.data();
        return {
          id: doc.id,
          ...messageData,
        };
      })
    );
    setMessages(messagesData);
  });

  return unsubscribe; // Cleanup the subscription
};

// Send a message from sender to receiver
export const sendMessage = async (newMessage, senderId, receiverId) => {
  if (newMessage.trim() === '') return;

  await addDoc(collection(db, 'messages'), {
    text: newMessage,
    senderId: senderId,
    receiverId: receiverId,
    timestamp: new Date(),
  });
};

// Fetch user details (first and last name) from Firestore given the user ID
export const fetchUserDetails = async (userId) => {
  if (!userId) return { firstName: 'Unknown', lastName: 'User' };

  const userDoc = await getDoc(doc(db, 'users', userId)); // Assume users collection exists
  if (userDoc.exists()) {
    const { firstName, lastName } = userDoc.data();
    return { firstName, lastName }; // Return first and last name
  } else {
    return { firstName: 'User', lastName: '' }; // Return default values if user not found
  }
};

// Requests permissions to show notifications
async function requestNotificationsPermissions(uid) {
  console.log('Requesting notifications permission...');
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Notification permission granted.');
    await saveMessagingDeviceToken(uid);
  } else {
    console.log('Unable to get permission to notify.');
  }
}

// Saves the messaging device token to Cloud Firestore
export async function saveMessagingDeviceToken(uid) {
  console.log('Saving messaging device token');

  try {
    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (fcmToken) {
      console.log('Got FCM device token:', fcmToken);
      const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
      await setDoc(tokenRef, { fcmToken });

      // Listen for messages received while the app is in the foreground
      onMessage(messaging, (message) => {
        console.log('New foreground notification from Firebase Messaging!', message.notification);
        new Notification(message.notification.title, { body: message.notification.body });
      });
    } else {
      requestNotificationsPermissions(uid);
    }
  } catch (error) {
    console.error('Unable to get messaging token.', error);
  }
}
