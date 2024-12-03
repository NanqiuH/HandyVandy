import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../Layout/Header";
import styles from "./HistoryPage.module.css";

function HistoryPage() {
  const { id } = useParams();
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [soldPosts, setSoldPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userDoc = await getDoc(doc(db, "profiles", id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPurchasedPosts(userData.purchasedPosts || []);
          setSoldPosts(userData.soldPosts || []);
        } else {
          console.error("User profile not found.");
        }
      } catch (error) {
        console.error("Error fetching history: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHistory();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <main className={styles.historyPage}>
        <h1>Transaction History</h1>
        <div className={styles.historySection}>
          <h2>Purchased Posts</h2>
          {purchasedPosts.length === 0 ? (
            <p>No purchases yet.</p>
          ) : (
            <ul>
              {purchasedPosts.map((post) => (
                <li key={post.postingId}>
                  <h3>{post.postingName}</h3>
                  <p>Price: ${post.price}</p>
                  <p>Purchased on: {new Date(post.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.historySection}>
          <h2>Sold Posts</h2>
          {soldPosts.length === 0 ? (
            <p>No sales yet.</p>
          ) : (
            <ul>
              {soldPosts.map((post) => (
                <li key={post.postingId}>
                  <h3>{post.postingName}</h3>
                  <p>Price: ${post.price}</p>
                  <p>Sold on: {new Date(post.createdAt).toLocaleString()}</p>
                  <p>Buyer ID: {post.buyerId}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default HistoryPage;
