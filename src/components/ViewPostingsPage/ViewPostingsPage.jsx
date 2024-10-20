import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // Import Link for navigation
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../firebase"; // Firebase config
import Header from "../Layout/Header"; // Import Header
import styles from "./ViewPostingsPage.module.css"; // Custom CSS

function ViewPostingsPage() {
  const [postings, setPostings] = useState([]);

  // Fetch postings from Firestore when the component mounts
  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const postingsCollection = collection(db, "postings");
        const postingsSnapshot = await getDocs(postingsCollection);
        const postingsList = postingsSnapshot.docs.map((doc) => ({
          id: doc.id, // Store document ID
          ...doc.data(),
        }));
        setPostings(postingsList);
      } catch (error) {
        console.error("Error fetching postings: ", error);
      }
    };

    fetchPostings();
  }, []);

  return (
    <div>
      <Header />
      <main className={styles.postingsPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Postings</h1>
          </header>
          <div className={styles.postingsList}>
            {postings.length === 0 ? (
              <p>No postings available.</p>
            ) : (
              postings.map((posting) => (
                <Link
                  to={`/posting/${posting.id}`} // Link to the SinglePostViewPage
                  key={posting.id} // Ensure unique key for each posting
                  className={styles.postingLink}
                >
                  <div className={styles.postingCard}>
                    {posting.postingImageUrl && (
                      <img
                        src={posting.postingImageUrl}
                        alt={posting.postingName}
                        className={styles.postingImage}
                      />
                    )}
                    <div className={styles.postingCardContent}>
                      <h2 className={styles.postingName}>{posting.postingName}</h2>
                      <p className={styles.postingDescription}>
                        {posting.description}
                      </p>
                      <p className={styles.postingPrice}>Price: ${posting.price}</p>
                      <p className={styles.postingType}>
                        {posting.serviceType === "offering"
                          ? "Offering"
                          : "Requesting"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewPostingsPage;
