import React from "react";
import { Link } from "react-router-dom";  // Import Link for navigation
import styles from "./ProfileListPage.module.css";
import profiles from "../../dummy-data/dummy-data.jsx"
import Header from "../Layout/Header.jsx";

function ProfileListPage() {
  return (
    <div>
    <Header />
      <main className={styles.profileListPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Profiles</h1>
          </header>
          <div className={styles.profileList}>
            {profiles.map((profile) => (
              <Link
                to={`/profile/${profile.id}`}  // Link to profile detail page
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
      </div>
  );
}

export default ProfileListPage;
