import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../../firebase"; // Firebase config
import styles from "./ProfileViewPage.module.css";
import Header from "../Layout/Header";

function ProfileViewPage() {
  const { id } = useParams(); // Get the profile ID from the URL
  const [profile, setProfile] = useState(null); // State to hold the profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRef = doc(db, "profiles", id); // Reference to the specific document
        const profileSnap = await getDoc(profileRef); // Fetch the document

        if (profileSnap.exists()) {
          setProfile(profileSnap.data()); // Set the profile data
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchProfile();
  }, [id]); // Fetch the profile whenever the ID changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Header />
      <main className={styles.profileDetailPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              {profile.firstName} {profile.middleName} {profile.lastName}
            </h1>
          </header>
          <div className={styles.profileContent}>
            <div className={styles.profileSidebar}>
              <img
                src={profile.profileImage}
                alt={`${profile.firstName} ${profile.lastName}`}
                className={styles.profileImage}
              />
              <div className={styles.profileInfo}>
                <div className={styles.rating}>{"⭐️⭐️⭐️⭐️⭐️"}</div>
                <button className={styles.friendButton}>
                  Send Friend Request
                </button>
              </div>
            </div>
            <div className={styles.profileDetails}>
              <h2 className={styles.bioTitle}>Bio</h2>
              <p className={styles.bio}>{profile.bio}</p>
              <h3 className={styles.postsTitle}>Posts</h3>
              {profile.posts && profile.posts.length > 0 ? (
                <ul className={styles.postsList}>
                  {profile.posts.map((post) => (
                    <li key={post.id} className={styles.postItem}>
                      {post.title} - ${post.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No posts available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileViewPage;