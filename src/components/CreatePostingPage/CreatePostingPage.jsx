import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePostingPage.module.css";
import Header from "../Layout/Header";
import { db, auth, storage } from "../../firebase"; // Import Firebase Firestore, Auth, and Storage
import { collection, addDoc } from "firebase/firestore"; // Firestore functions to add documents
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage functions to handle image upload
import CategoryOptions from "../../options/CategoryOptions";
import ServiceTypeOptions from "../../options/ServiceOptions";

function CreatePostingPage() {
  // State to manage form data
  const [formData, setFormData] = useState({
    postingName: "",
    description: "",
    price: "",
    postingImage: null,
    serviceType: "none", // Default value for Service Type
    category: "none", // Default value for Category
  });

  // State to manage validation errors
  const [serviceTypeError, setServiceTypeError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [postingNameError, setPostingNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  // Hook to navigate to a different page after form submission
  const navigate = useNavigate();

  // Function to handle changes to input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset error state when user starts typing in the fields
    if (name === "postingName") setPostingNameError(false);
    if (name === "description") setDescriptionError(false);
    if (name === "price") setPriceError(false);
  };

  // Function to handle image file upload
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      postingImage: e.target.files[0],
    });
  };

  // Function to handle service type dropdown change
  const handleServiceTypeChange = (e) => {
    setFormData({
      ...formData,
      serviceType: e.target.value,
    });
    setServiceTypeError(false);
  };

  // Function to handle category dropdown change
  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value,
    });
    setCategoryError(false);
  };

  console.log(formData);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks for empty or invalid fields
    let hasError = false;
    if (formData.serviceType === "none") {
      setServiceTypeError(true);
      hasError = true;
    }
    if (formData.category === "none") {
      setCategoryError(true);
      hasError = true;
    }
    if (formData.postingName.trim() === "") {
      setPostingNameError(true);
      hasError = true;
    }
    if (formData.description.trim() === "") {
      setDescriptionError(true);
      hasError = true;
    }
    if (formData.price.trim() === "") {
      setPriceError(true);
      hasError = true;
    }

    // If there are validation errors, don't proceed
    if (hasError) {
      return; 
    }

    try {
      const user = auth.currentUser; // Get current authenticated user
      if (!user) {
        throw new Error("User not authenticated"); // If not authenticated, throw an error
      }

      let postingImageUrl = null;
      if (formData.postingImage) {
        // If an image is uploaded, save it to Firebase Storage
        const storageRef = ref(storage, `postingImages/${formData.postingImage.name}`);
        await uploadBytes(storageRef, formData.postingImage); // Upload the image
        postingImageUrl = await getDownloadURL(storageRef); // Get the download URL for the image
      }

      const timestamp = new Date().toISOString(); // Create a timestamp for when the posting is created

      // Add the new posting to the "postings" collection in Firestore
      await addDoc(collection(db, "postings"), {
        postingName: formData.postingName,
        description: formData.description,
        price: formData.price,
        postingImageUrl: postingImageUrl, // Image URL (if uploaded)
        serviceType: formData.serviceType,
        category: formData.category,
        postingUID: user.uid, // Store the user ID of the poster
        createdAt: timestamp, // Add timestamp to the document
      });

      navigate("/posting-list"); // Redirect to the postings list page after success
    } catch (error) {
      console.error("Error adding document: ", error); // Handle any errors during the form submission
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.postingCreatePage}>
        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.formSection}>
              <div className={styles.formContainer}>
                <header className={styles.header}>
                  <h1 className={styles.title}>Create a New Posting</h1>
                </header>
                <form onSubmit={handleSubmit} className={styles.form}>

                {/* Posting Name Field */}
                <div className={`${styles.inputGroup} ${postingNameError ? styles.error : ""}`}>
                  <label htmlFor="postingName" className={styles.label}>
                    Posting Name
                  </label>
                  <input
                    id="postingName"
                    name="postingName"
                    value={formData.postingName}
                    onChange={handleChange}
                    className={`${styles.input} ${postingNameError ? styles.errorInput : ""}`}
                    required
                  />
                  {postingNameError && (
                    <span className={styles.errorMessage}>
                      Please enter a valid posting name.
                    </span>
                  )}
                </div>

                {/* Description Field */}
                <div className={`${styles.inputGroup} ${descriptionError ? styles.error : ""}`}>
                  <label htmlFor="description" className={styles.label}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`${styles.textarea} ${descriptionError ? styles.errorInput : ""}`}
                    required
                  />
                  {descriptionError && (
                    <span className={styles.errorMessage}>
                      Please enter a description.
                    </span>
                  )}
                </div>

                {/* Price, Service Type, and Category Fields Side by Side */}
                <div className={styles.row}>
                  {/* Price Field */}
                  <div className={`${styles.inputGroup} ${priceError ? styles.error : ""}`}>
                    <label htmlFor="price" className={styles.label}>
                      Price
                    </label>
                    <div className={styles.priceInputContainer}>
                      <span className={styles.dollarSign}>$</span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`${styles.input} ${priceError ? styles.errorInput : ""}`}
                        required
                        min="0"
                        step="any"
                      />
                    </div>
                    {priceError && (
                      <span className={styles.errorMessage}>
                        Please enter a valid price.
                      </span>
                    )}
                  </div>

                  {/* Service Type Field */}
                  <div className={`${styles.inputGroup} ${serviceTypeError ? styles.error : ""}`}>
                    <label htmlFor="serviceType" className={styles.label}>
                      Service Type
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleServiceTypeChange}
                      className={`${styles.select} ${serviceTypeError ? styles.errorInput : ""}`}
                    >
                      <option value="none">None</option>
                      <ServiceTypeOptions />
                    </select>
                    {serviceTypeError && (
                      <span className={styles.errorMessage}>
                        Please select a valid service type.
                      </span>
                    )}
                  </div>

                  {/* Category Field */}
                  <div className={`${styles.inputGroup} ${categoryError ? styles.error : ""}`}>
                    <label htmlFor="category" className={styles.label}>
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className={`${styles.select} ${categoryError ? styles.errorInput : ""}`}
                    >
                    <CategoryOptions />
                    </select>
                    {categoryError && (
                      <span className={styles.errorMessage}>
                        Please select a valid category.
                      </span>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className={styles.inputGroup}>
                  <label htmlFor="postingImage" className={styles.label}>
                    Upload an Image
                  </label>
                  <input
                    type="file"
                    id="postingImage"
                    name="postingImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.input}
                  />
                </div>

                <button type="submit" className={styles.button}>
                  Create Posting
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

export default CreatePostingPage;
