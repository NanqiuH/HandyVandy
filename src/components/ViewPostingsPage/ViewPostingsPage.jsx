import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../firebase"; // Firebase config
import Layout from "../Layout/Layout"; // Import Layout
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
          id: doc.id,
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
    <Layout>
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
                <div key={posting.id} className={styles.postingCard}>
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
              ))
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ViewPostingsPage;
