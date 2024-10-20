import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from React Router
import styles from "./CreateProfilePage.module.css";
import Header from "../Layout/Header"
import { db } from "../../firebase";

function CreateProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    bio: "",
    profileImage: null,
  });

  const navigate = useNavigate();
  // const currentUser = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    navigate("/");
  };

  return (
    <div>
    <Header />
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
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateProfilePage;
