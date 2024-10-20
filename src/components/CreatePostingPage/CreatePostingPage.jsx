import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from React Router
import styles from "./CreatePostingPage.module.css";
import Layout from "../Layout/Layout";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function CreatePostingPage() {
  const [formData, setFormData] = useState({
    postingName: "",
    description: "",
    price: "",
    postingImage: null,
    serviceType: "offering", // Default option for service type
  });

  const navigate = useNavigate();

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
      postingImage: e.target.files[0],
    });
  };

  const handleServiceTypeChange = (e) => {
    setFormData({
      ...formData,
      serviceType: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      let postingImageUrl = null;
      if (formData.postingImage) {
        const storageRef = ref(storage, `postingImages/${formData.postingImage.name}`);
        await uploadBytes(storageRef, formData.postingImage);
        postingImageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "users", user.uid, "postings"), {
        postingName: formData.postingName,
        description: formData.description,
        price: formData.price,
        postingImageUrl: postingImageUrl,
        serviceType: formData.serviceType,
      });

      alert("Posting created successfully");

      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Layout>
      <main className={styles.postingCreatePage}>
        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.formSection}>
              <div className={styles.formContainer}>
                <header className={styles.header}>
                  <h1 className={styles.title}>Create a New Posting</h1>
                </header>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="postingName" className={styles.label}>
                      Posting Name
                    </label>
                    <input
                      type="text"
                      id="postingName"
                      name="postingName"
                      value={formData.postingName}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="description" className={styles.label}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={styles.textarea}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="price" className={styles.label}>
                      Price
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="postingImage" className={styles.label}>
                      Attach Image
                    </label>
                    <input
                      type="file"
                      id="postingImage"
                      name="postingImage"
                      onChange={handleImageChange}
                      className={styles.inputFile}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="serviceType" className={styles.label}>
                      Are you offering or requesting a service?
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleServiceTypeChange}
                      className={styles.select}
                    >
                      <option value="offering">Offering</option>
                      <option value="requesting">Requesting</option>
                    </select>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Create Posting
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default CreatePostingPage;
