import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the ID from the URL
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../../firebase"; // Firebase config
import Header from "../Layout/Header"; // Import Header
import styles from "./SinglePostViewPage.module.css"; // Custom CSS

function SinglePostingPage() {
  const { id } = useParams(); // Get the posting ID from the URL
  const [posting, setPosting] = useState(null); // State to hold the posting data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const docRef = doc(db, "postings", id); // Reference to the specific posting
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          setPosting(docSnap.data()); // Set the posting data
        } else {
          setError("Posting not found.");
        }
      } catch (err) {
        console.error("Error fetching posting:", err);
        setError("Failed to load posting.");
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchPosting();
  }, [id]);

  const handlePurchase = () => {
    // Placeholder function for purchase logic
    alert(`You have purchased: ${posting.postingName}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Header />
      <main className={styles.postingDetailPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>{posting.postingName}</h1>
          </header>
          <div className={styles.postingContent}>
            {posting.postingImageUrl && (
              <img
                src={posting.postingImageUrl}
                alt={posting.postingName}
                className={styles.postingImage}
              />
            )}
            <div className={styles.postingDetails}>
              <p className={styles.postingDescription}>{posting.description}</p>
              <p className={styles.postingPrice}>Price: ${posting.price}</p>
              <p className={styles.postingType}>
                {posting.serviceType === "offering" ? "Offering" : "Requesting"}
              </p>
              {/* Purchase Button */}
              <button className={styles.purchaseButton} onClick={handlePurchase}>
                Purchase
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SinglePostingPage;
