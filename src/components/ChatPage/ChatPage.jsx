import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessages, sendMessage, fetchUserName } from '../../messaging'; // Corrected import
import { saveMessagingDeviceToken } from '../../messaging'; // For FCM token handling
import Header from '../Layout/Header';
import styles from './ChatPage.module.css';

function ChatPage() {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [usernames, setUsernames] = useState({});
  const [receiverUsername, setReceiverUsername] = useState('');
  const senderId = 'yourSenderId'; // Placeholder for the current user

  useEffect(() => {
    const fetchReceiverUsername = async () => {
      const username = await fetchUserName(receiverId, setUsernames, usernames);
      setReceiverUsername(username);
    };

    fetchReceiverUsername();
  }, [receiverId, usernames]);

  useEffect(() => {
    const unsubscribe = fetchMessages(receiverId, senderId, setMessages, (userId) =>
      fetchUserName(userId, setUsernames, usernames)
    );

    return () => unsubscribe();
  }, [receiverId, senderId, usernames]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(newMessage, senderId, receiverId);
    setNewMessage('');
    await saveMessagingDeviceToken(senderId);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div>
      <Header />
      <main className={styles.chatPageContainer}>
        <h1>Chat with {receiverUsername}</h1>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.senderId === senderId ? styles.sentMessage : styles.receivedMessage
              }`}
            >
              <strong>{message.username}: </strong>
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
