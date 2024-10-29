import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./ProfileViewPage.module.css";
import Header from "../Layout/Header";
import anonProfile from "../../images/anon_profile.png";

function ProfileViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      try {
        const profileRef = doc(db, "profiles", id);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());

          const reviewsQuery = query(
            collection(db, "reviews"),
            where("revieweeId", "==", id)
          );
          const reviewsSnapshot = await getDocs(reviewsQuery);
          const fetchedReviews = reviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          fetchedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setReviews(fetchedReviews);
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error("Error fetching profile or reviews:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndReviews();
  }, [id]);

  const handleSendMessage = () => {
    navigate(`/chat/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const profileImageUrl = profile.profileImageUrl || anonProfile;
  const starRating = "★".repeat(Math.round(profile.rating)) + "☆".repeat(5 - Math.round(profile.rating));

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
                src={profileImageUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className={styles.profileImage}
              />
              <div className={styles.profileInfo}>
                <div className={styles.rating}>
                  <span>{starRating}</span> ({reviews.length} reviews)
                </div>
                <button className={styles.friendButton}>Send Friend Request</button>
                <button className={styles.messageButton} onClick={handleSendMessage}>Send Message</button>
                <button
                  className={styles.reviewButton}
                  onClick={() =>
                    navigate(`/review/${id}`, {
                      state: { revieweeId: id, revieweeName: `${profile.firstName} ${profile.lastName}` }
                    })
                  }
                >
                  Leave a Review
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
              <h3 className={styles.reviewsTitle}>Reviews</h3>
              {reviews.length > 0 ? (
                <ul className={styles.reviewsList}>
                  {reviews.map((review) => (
                    <li key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewContent}>
                        <p className={styles.reviewRating}>
                          { "★".repeat(Math.round(review.rating)) + "☆".repeat(5 - Math.round(review.rating)) }
                        </p>
                        <p className={styles.reviewComment}>{review.comment}</p>
                        <p className={styles.reviewerName}>— {review.reviewerName}</p>
                      </div>
                      <p className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileViewPage;
