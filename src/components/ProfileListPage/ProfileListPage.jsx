import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./ProfileListPage.module.css";
import Layout from "../Layout/Layout.jsx";

function ProfileListPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const profilesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching profiles: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <main className={styles.profileListPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Profiles</h1>
          </header>
          <div className={styles.profileList}>
            {profiles.map((profile) => (
              <Link
                to={`/profile/${profile.id}`}
                key={profile.id}
                className={styles.profileLink}
              >
                <div className={styles.profileCard}>
                  <img
                    src={profile.profileImage}
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
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ProfileListPage;