import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./ChatPage.module.css";

function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usernames, setUsernames] = useState({});
  const [receiverUsername, setReceiverUsername] = useState("");
  const senderId = "yourSenderId";

  const fetchUsername = async (userId) => {
    if (!userId) return "Unknown";
    if (usernames[userId]) return usernames[userId];

    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const username = userDoc.data().username;
      setUsernames((prev) => ({ ...prev, [userId]: username }));
      return username;
    } else {
      return "User";
    }
  };

  useEffect(() => {
    const fetchReceiverUsername = async () => {
      const username = await fetchUsername(id);
      setReceiverUsername(username);
    };

    fetchReceiverUsername();
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const messagesData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const messageData = doc.data();
            const username = await fetchUsername(messageData.senderId);
            return {
              id: doc.id,
              ...messageData,
              username,
            };
          })
        );
        setMessages(messagesData);
      });

      return () => unsubscribe();
    };

    fetchMessages();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: senderId,
        receiverId: id,
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div>
      <h1>Chat with {receiverUsername}</h1>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={`${styles.message} ${message.senderId === "yourSenderId" ? styles.sentMessage : styles.receivedMessage}`}>
            <strong>{message.username}: </strong>{message.text}
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
    </div>
  );
}

export default ChatPage;
