import { db, messaging } from "./firebase";
import { doc, setDoc, collection, query, orderBy, addDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

export const FCM_TOKEN_COLLECTION = "fcmTokens";
const VAPID_KEY = "BEQFx3BckKgroKNiBuxoGEBUMpzkzols0HkFn7FR_Vst4XF8fhEszkXLJvzYgEBmltxr0NMq7rf";

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

  return unsubscribe;
};

export const sendMessage = async (newMessage, senderId, receiverId) => {
  if (newMessage.trim() === '') return;

  await addDoc(collection(db, 'messages'), {
    text: newMessage,
    senderId: senderId,
    receiverId: receiverId,
    timestamp: new Date(),
  });
};

export const fetchUserDetails = async (userId) => {
  if (!userId) return { firstName: 'Unknown', lastName: 'User' };

  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const { firstName, lastName } = userDoc.data();
    return { firstName, lastName };
  } else {
    return { firstName: 'User', lastName: '' };
  }
};

async function requestNotificationsPermissions(uid) {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    await saveMessagingDeviceToken(uid);
  }
}

export async function saveMessagingDeviceToken(uid) {
  try {
    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (fcmToken) {
      const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
      await setDoc(tokenRef, { fcmToken });

      onMessage(messaging, (message) => {
        new Notification(message.notification.title, { body: message.notification.body });
      });
    } else {
      requestNotificationsPermissions(uid);
    }
  } catch (error) {
    console.error('Unable to get messaging token.', error);
  }
}
