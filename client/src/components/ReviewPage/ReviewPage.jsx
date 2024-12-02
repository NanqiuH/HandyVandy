import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReviewPage.module.css";
import Header from "../Layout/Header";
import { db, auth } from "../../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

function ReviewPage() {
  const location = useLocation();
  const { revieweeId, revieweeName } = location.state;

  const [formData, setFormData] = useState({
    rating: 1,
    comment: "",
  });

  const [commentError, setCommentError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "comment") setCommentError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.comment.trim() === "") {
      setCommentError(true);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Fetch the reviewer's profile from the "profiles" collection
      const userProfileRef = doc(db, "profiles", user.uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (!userProfileSnap.exists()) {
        throw new Error("User profile not found");
      }

      const userProfile = userProfileSnap.data();
      const reviewerName = `${userProfile.firstName} ${userProfile.lastName}`;

      const timestamp = new Date().toISOString();
      await addDoc(collection(db, "reviews"), {
        rating: parseInt(formData.rating), // Ensure rating is an integer
        comment: formData.comment,
        reviewerUID: user.uid,
        reviewerName, // Include reviewer name
        revieweeId,
        revieweeName,
        createdAt: timestamp,
      });

      alert("Review submitted successfully!");
      navigate("/profile-list");
    } catch (error) {
      console.error("Error adding review or retrieving profile: ", error);
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.reviewPage}>
        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.formSection}>
              <div className={styles.formContainer}>
                <header className={styles.header}>
                  <h1 className={styles.title}>
                    Leave a Review for {revieweeName}
                  </h1>
                </header>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="rating" className={styles.label}>
                      Rating
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <div
                    className={`${styles.inputGroup} ${
                      commentError ? styles.error : ""
                    }`}
                  >
                    <label htmlFor="comment" className={styles.label}>
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      className={`${styles.textarea} ${
                        commentError ? styles.errorInput : ""
                      }`}
                      required
                    />
                    {commentError && (
                      <span className={styles.errorMessage}>
                        Please enter a comment.
                      </span>
                    )}
                  </div>

                  <button type="submit" className={styles.button}>
                    Submit Review
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReviewPage;
