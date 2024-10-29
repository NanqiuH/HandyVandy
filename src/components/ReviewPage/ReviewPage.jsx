import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReviewPage.module.css";
import Header from "../Layout/Header";
import { db, auth } from "../../firebase"; // Import Firebase Firestore and Auth
import { collection, addDoc } from "firebase/firestore"; // Firestore functions to add documents

function ReviewPage() {
  const location = useLocation(); // Get location from React Router
  const { revieweeId, revieweeName } = location.state; // Destructure revieweeId and revieweeName
  
  // State to manage form data
  const [formData, setFormData] = useState({
    rating: 1, // Default rating
    comment: "",
  });

  // State to manage validation errors
  const [commentError, setCommentError] = useState(false);

  // Hook to navigate to a different page after form submission
  const navigate = useNavigate();

  // Function to handle changes to input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset error state when user starts typing in the comment field
    if (name === "comment") setCommentError(false);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks for empty fields
    if (formData.comment.trim() === "") {
      setCommentError(true);
      return;
    }

    try {
      const user = auth.currentUser; // Get current authenticated user
      if (!user) {
        throw new Error("User not authenticated"); // If not authenticated, throw an error
      }

      const timestamp = new Date().toISOString(); // Create a timestamp for when the review is created

      // Add the new review to the "reviews" collection in Firestore
      await addDoc(collection(db, "reviews"), {
        rating: formData.rating,
        comment: formData.comment,
        reviewerUID: user.uid, // Store the user ID of the reviewer
        revieweeId: revieweeId, // Store the ID of the person being reviewed
        revieweeName: revieweeName, // Store the name of the person being reviewed
        createdAt: timestamp, // Add timestamp to the document
      });

      alert("Review submitted successfully"); // Show success message

      // Navigate to the profile of the reviewee after submitting the review
      navigate(`/profile/${revieweeId}`); // Redirect to the reviewee's profile
    } catch (error) {
      console.error("Error adding document: ", error); // Handle any errors during the form submission
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
                  <h1 className={styles.title}>Leave a Review for {revieweeName}</h1> {/* Display the reviewee's name */}
                </header>
                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Rating Selection */}
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

                  {/* Comment Field */}
                  <div className={`${styles.inputGroup} ${commentError ? styles.error : ""}`}>
                    <label htmlFor="comment" className={styles.label}>
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      className={`${styles.textarea} ${commentError ? styles.errorInput : ""}`}
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
