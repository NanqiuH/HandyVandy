import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./ProfileViewPage.module.css";
import Layout from "../Layout/Layout";

function ProfileViewPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "profiles", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No such document!");
          setProfile(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <Layout>
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
                <button className={styles.friendButton}>Send Friend Request</button>
              </div>
            </div>
            <div className={styles.profileDetails}>
              <p>{profile.bio}</p>
              {/* Add more profile details here as needed */}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ProfileViewPage;