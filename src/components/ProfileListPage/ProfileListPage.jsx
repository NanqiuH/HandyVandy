import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // Import Link for navigation
import styles from "./ProfileListPage.module.css";
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import { db } from "../../firebase"; // Import Firebase config
import Header from "../Layout/Header.jsx";

function ProfileListPage() {
  const [profiles, setProfiles] = useState([]); // State to hold profiles

  // Fetch profiles from Firestore when the component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilesCollection = collection(db, "profiles"); // Adjust collection name
        const profilesSnapshot = await getDocs(profilesCollection);
        const profilesList = profilesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(profilesList);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []); // Empty dependency array to run only on mount
  
  return (
    <div>
      <Header />
      <main className={styles.profileListPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Profiles</h1>
          </header>
          <div className={styles.profileList}>
            {profiles.length === 0 ? (
              <p>No profiles available.</p>
            ) : (
              profiles.map((profile) => (
                <Link
                  to={`/profile/${profile.id}`}  // Link to profile detail page
                  key={profile.id}
                  className={styles.profileLink}
                >
                  <div className={styles.profileCard}>
                    <img
                      src={profile.profileImageUrl}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className={styles.profileImage}
                    />
                    <div className={styles.profileCardContent}>
                      <div className={styles.profileDetails}>
                        <h2 className={styles.profileName}>
                          {profile.firstName} {profile.middleName} {profile.lastName}
                        </h2>
                        <p className={styles.profileBio}>{profile.bio}</p>
                      </div>
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

export default ProfileListPage;