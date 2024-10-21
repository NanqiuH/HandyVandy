import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase config
import styles from "./ChatPage.module.css"; // Import your CSS module

function ChatPage() {
  const { id } = useParams(); // Get the profile ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usernames, setUsernames] = useState({}); // Store usernames by their IDs
  const [receiverUsername, setReceiverUsername] = useState(""); // Store the receiver's username

  // Fetch usernames based on senderId
  const fetchUsername = async (userId) => {
    if (!userId) return "Unknown"; // Fallback in case userId is not found
    if (usernames[userId]) return usernames[userId]; // Return cached username if already fetched

    const userDoc = await getDoc(doc(db, "users", userId)); // Assuming you have a "users" collection
    if (userDoc.exists()) {
      const username = userDoc.data().username;
      setUsernames((prev) => ({ ...prev, [userId]: username })); // Cache the fetched username
      return username;
    } else {
      return "User"; // Handle case where user doesn't exist
    }
  };

  // Fetch the receiver's username when the component loads
  useEffect(() => {
    const fetchReceiverUsername = async () => {
      const username = await fetchUsername(id); // Fetch the username of the receiver based on the `id`
      setReceiverUsername(username);
    };

    fetchReceiverUsername();
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesRef = collection(db, "messages");

      // Order by timestamp so that the messages appear in the correct order
      const q = query(messagesRef, orderBy("timestamp", "asc")); // Ordering by timestamp in ascending order

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const messagesData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const messageData = doc.data();
            const username = await fetchUsername(messageData.senderId); // Fetch the sender's username
            return {
              id: doc.id,
              ...messageData,
              username, // Add the username to the message object
            };
          })
        );
        setMessages(messagesData);
      });

      return () => unsubscribe(); // Cleanup on unmount
    };

    fetchMessages();
  }, [id]);

  // Function to handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: "yourSenderId", // Replace with your actual sender ID
        receiverId: id, // The ID of the user you're messaging
        timestamp: new Date(), // Timestamp for ordering
      });
      setNewMessage(""); // Clear the input field
    }
  };

  // Helper function to format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Firestore returns timestamp as seconds
    return date.toLocaleString(); // Format the date and time as a readable string
  };

  return (
    <div>
      <h1>Chat with {receiverUsername}</h1> {/* Display receiver's username */}
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={styles.message}>
            <strong>{message.username}: </strong>{message.text}
            <div className={styles.timestamp}>{formatDate(message.timestamp)}</div> {/* Display timestamp */}
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
