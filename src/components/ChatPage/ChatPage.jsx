import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessages, sendMessage, saveMessagingDeviceToken } from '../../messaging'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { db, auth } from '../../firebase'; 
import Header from '../Layout/Header';
import styles from './ChatPage.module.css';

function ChatPage() {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverFullName, setReceiverFullName] = useState('');

  const user = auth.currentUser;
  const senderId = user ? user.uid : null;

  useEffect(() => {
    const fetchReceiverFullName = async () => {
      try {
        const userDocRef = doc(db, 'profiles', receiverId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const { firstName, lastName } = userDocSnap.data();
          setReceiverFullName(`${firstName} ${lastName}`);
        } else {
          console.error("User not found for ID:", receiverId);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchReceiverFullName();
  }, [receiverId]);

  useEffect(() => {
    const unsubscribe = fetchMessages(receiverId, senderId, setMessages);
    return () => unsubscribe();
  }, [receiverId, senderId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (senderId) {
      await sendMessage(newMessage, senderId, receiverId);
      setNewMessage('');
      await saveMessagingDeviceToken(senderId);
    } else {
      console.error("User not authenticated");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div>
      <Header />
      <main className={styles.chatPageContainer}>
        <h1>Chat with {receiverFullName || 'User'}</h1>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${message.senderId === senderId ? styles.sentMessage : styles.receivedMessage}`}
            >
              <strong>{message.senderId === senderId ? "You" : receiverFullName}: </strong>
              {message.text}
              <div className={styles.timestamp}>{formatDate(message.timestamp)}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className={styles.messageForm}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.messageInput}
          />
          <button type="submit" className={styles.sendButton}>Send</button>
        </form>
      </main>
    </div>
  );
}

export default ChatPage;
