import React from "react";
import { useParams } from "react-router-dom";
import styles from "./ProfileViewPage.module.css";
import profiles from "../../dummy-data/dummy-data";
import Layout from "../Layout/Layout";

function ProfileViewPage() {
  const { id } = useParams();
  const profile = profiles.find((p) => p.id === parseInt(id));

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
            <img
              src={profile.profileImage}
              alt={`${profile.firstName} ${profile.lastName}`}
              className={styles.profileImage}
            />
            <p className={styles.bio}>{profile.bio}</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ProfileViewPage;
