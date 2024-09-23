import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from React Router
import styles from "./CreateProfilePage.module.css";

function CreateProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    bio: "",
    profileImage: null,
  });

  const navigate = useNavigate();  // Initialize the navigation hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., API call to save the profile)
    console.log(formData);

    // After form submission, navigate to the home page
    navigate("/");
  };

  const handleBack = () => {
    // Go back to the home page
    navigate("/");
  };

  return (
    <main className={styles.profileCreatePage}>
      <div className={styles.container}>
        <div className={styles.content}>
          <section className={styles.formSection}>
            <div className={styles.formContainer}>
              <header className={styles.header}>
                <h1 className={styles.title}>Create Your Profile</h1>
              </header>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName" className={styles.label}>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="middleName" className={styles.label}>
                    Middle Name (optional)
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="bio" className={styles.label}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className={styles.textarea}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="profileImage" className={styles.label}>
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleImageChange}
                    className={styles.inputFile}
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Create Profile
                </button>
              </form>

              {/* Add a Back button */}
              <button
                type="button"
                className={styles.backButton}
                onClick={handleBack}
              >
                Back to Home
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CreateProfilePage;
