import { db, messaging } from "./firebase";
import { doc, setDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { collection, query, orderBy, addDoc, onSnapshot, getDoc } from 'firebase/firestore';

export const FCM_TOKEN_COLLECTION = "fcmTokens";
export const FCM_TOKEN_KEY = "fcmToken"; // key for storing FCM token in Firestore
const VAPID_KEY = "BEQFx3BckKgroKNiBuxoGEBUMpzkzols0HkFn7FR_Vst4XF8fhEszkXLJvzYgEBmltxr0NMq7rf"; // Your VAPID Key from Firebase Console

// Fetch messages between sender and receiver, ordered by timestamp
export const fetchMessages = (receiverId, senderId, setMessages, fetchUserName) => {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const messagesData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const messageData = doc.data();
        const senderName = await fetchUserName(messageData.senderId); // Fetch the first and last name
        return {
          id: doc.id,
          ...messageData,
          senderName, // Store first and last name instead of username
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

// Fetch the first and last name from Firestore given the user ID
export const fetchUserName = async (userId, setUserNames, userNames) => {
  if (!userId) return 'Unknown User';
  if (userNames[userId]) return userNames[userId]; // Use cached name if available

  const userDoc = await getDoc(doc(db, 'users', userId)); // Assume users collection exists
  if (userDoc.exists()) {
    const { firstName, lastName } = userDoc.data();
    const fullName = `${firstName} ${lastName}`; // Combine first and last name
    setUserNames((prev) => ({ ...prev, [userId]: fullName })); // Cache the full name
    return fullName;
  } else {
    return 'User';
  }
};

// Requests permissions to show notifications.
async function requestNotificationsPermissions(uid) {
  console.log('Requesting notifications permission...');
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    // Notification permission granted.
    await saveMessagingDeviceToken(uid);
  } else {
    console.log('Unable to get permission to notify.');
  }
}

// Saves the messaging device token to Cloud Firestore.
export async function saveMessagingDeviceToken(uid) {
  console.log('save msg device token');

  try {
    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (fcmToken) {
      console.log('Got FCM device token:', fcmToken);
      // Save device token to Firestore
      const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
      await setDoc(tokenRef, { fcmToken });
      // This will fire when a message is received while the app is in the foreground.
      // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
      onMessage(messaging, (message) => {
        console.log(
          'New foreground notification from Firebase Messaging!',
          message.notification
        );
        new Notification(message.notification.title, { body: message.notification.body });
      });
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions(uid);
    }
  } catch (error) {
    console.error('Unable to get messaging token.', error);
  }
};
