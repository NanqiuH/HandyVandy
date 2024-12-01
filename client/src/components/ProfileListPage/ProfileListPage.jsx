import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ProfileListPage.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../Layout/Header.jsx";
import anonProfile from "../../images/anon_profile.png";

function ProfileListPage() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilesCollection = collection(db, "profiles");
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
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProfiles = profiles.filter((profile) => {
    const fullName = `${profile.firstName} ${profile.middleName || ""} ${profile.lastName}`
      .toLowerCase()
      .trim();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Header />
      <main className={styles.profileListPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Profiles</h1>
          </header>
          <div className="">
            <input
              type="text"
              placeholder="Search profiles..."
              className={styles.searchBar}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.profileList}>
            {filteredProfiles.length === 0 ? (
              <p>No profiles available.</p>
            ) : (
              filteredProfiles.map((profile) => {
                const profileImageUrl = profile.profileImageUrl || anonProfile;
                return (
                  <Link
                    to={`/profile/${profile.id}`}
                    key={profile.id}
                    className={styles.profileLink}
                  >
                    <div className={styles.profileCard}>
                      <img
                        src={profileImageUrl}
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
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileListPage;
