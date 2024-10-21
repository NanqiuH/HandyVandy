import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../Layout/Header";
import styles from "./SinglePostViewPage.module.css";
import HandyVandyLogo from "../../images/HandyVandyV.png";

function SinglePostingPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [posting, setPosting] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const docRef = doc(db, "postings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postingData = docSnap.data();
          setPosting(postingData);

          const userDocRef = doc(db, "users", postingData.postingUID);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUser(userDocSnap.data());
          }
        } else {
          setError("Posting not found.");
        }
      } catch (err) {
        console.error("Error fetching posting:", err);
        setError("Failed to load posting.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosting();
  }, [id]);

  const handlePurchase = () => {
    alert(`You have purchased: ${posting.postingName}`);
  };

  const handleMessage = () => {
    if (posting && posting.postingUID) {
      navigate(`/chat/${posting.postingUID}`); 
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const postingImageUrl = posting.postingImageUrl || HandyVandyLogo;

  return (
    <div>
      <Header />
      <main className={styles.postingDetailPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>{posting.postingName}</h1>
          </header>
          <div className={styles.postingContent}>
              <img
                src={postingImageUrl}
                alt={posting.postingName}
                className={styles.postingImage}
              />
            <div className={styles.postingDetails}>
              <p className={styles.postingDescription}>{posting.description}</p>
              <p className={styles.postingPrice}>Price: ${posting.price}</p>
              <p className={styles.postingType}>
                {posting.serviceType === "offering" ? "Offering" : "Requesting"}
              </p>
              <p className={styles.postingTimestamp}>
                Posted on: {new Date(posting.createdAt).toLocaleString()}
              </p>
              <p className={styles.postingUser}>
                Posted by: {user ? user.name || user.username : "Anonymous"}
              </p>
              <button className={styles.purchaseButton} onClick={handlePurchase}>
                Purchase
              </button>
              <button className={styles.messageButton} onClick={handleMessage}>
                Message {user ? user.name || user.username : "the seller"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SinglePostingPage;
