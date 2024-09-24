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
              <h2 className={styles.bioTitle}>Bio</h2>
              <p className={styles.bio}>{profile.bio}</p>
              <h3 className={styles.postsTitle}>Posts</h3>
              <ul className={styles.postsList}>
                {profile.posts.map((post) => (
                  <li key={post.id} className={styles.postItem}>
                    {post.title} - ${post.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ProfileViewPage;
