import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../Layout/Header";
import styles from "./SinglePostViewPage.module.css";
import HandyVandyLogo from "../../images/HandyVandyV.png";
import ServiceOptions from "../../options/ServiceOptions";
import CategoryOptions from "../../options/CategoryOptions";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function SinglePostingPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [posting, setPosting] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    postingName: "",
    description: "",
    price: "",
    serviceType: "",
    category: "",
    postingImage: null,
  });
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const docRef = doc(db, "postings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postingData = docSnap.data();
          setPosting(postingData);
          setUpdatedData({
            postingName: postingData.postingName,
            description: postingData.description,
            price: postingData.price,
            serviceType: postingData.serviceType,
            category: postingData.category,
            postingImage: null,
          });

          const currentUser = auth.currentUser;
          setIsOwner(currentUser && currentUser.uid === postingData.postingUID);
          
          if (postingData.postingUID) {
            const userDocRef = doc(db, "profiles", postingData.postingUID);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              setUser(userDocSnap.data());
            } else {
              console.error("User not found for UID:", postingData.postingUID);
            }
          } else {
            console.error("postingUID not found in posting data.");
          }
        } else {
          setError("Posting not found.");
        }
      } catch (err) {
        console.error("Error fetching posting:", err);
        setError("Failed to load posting.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosting();
  }, [id]);

  const handleEditToggle = () => {
    if (isOwner) {
      setIsEditing(!isEditing);
    } else {
      alert("You can only edit your own posting.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      postingImage: e.target.files[0],
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      const postingRef = doc(db, "postings", id);
      const postingSnap = await getDoc(postingRef);
    
      const existingCreatedAt = postingSnap.exists() ? postingSnap.data().createdAt : new Date().toISOString();
      let postingImageUrl = posting.postingImageUrl;

      if (updatedData.postingImage) {
        const imageRef = ref(storage, `postingImages/${updatedData.postingImage.name}`);
        await uploadBytes(imageRef, updatedData.postingImage);
        postingImageUrl = await getDownloadURL(imageRef);
      }

      const timestamp = new Date().toISOString();

      await updateDoc(postingRef, {
        postingName: updatedData.postingName,
        description: updatedData.description,
        price: updatedData.price,
        serviceType: updatedData.serviceType,
        category: updatedData.category,
        postingImageUrl: postingImageUrl,
        updatedAt: timestamp,
        createdAt: existingCreatedAt,
      });

      setPosting({ ...updatedData, postingImageUrl, createdAt: existingCreatedAt, updatedAt: timestamp });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating posting:", error);
      alert("Failed to update posting.");
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const postingRef = doc(db, "postings", id);
      await deleteDoc(postingRef);
      navigate("/posting-list");
    } catch (error) {
      console.error("Error deleting posting:", error);
      alert("Failed to delete post.");
    }
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posting }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to initiate checkout.');
    }
    // alert(`You have purchased: ${posting.postingName}`);
  };

  const handleMessage = () => {
    if (posting && posting.postingUID) {
      navigate(`/chat/${posting.postingUID}`); 
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const postingImageUrl = posting.postingImageUrl || HandyVandyLogo;

  return (
    <div>
      <Header />
      <main className={styles.postingDetailPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>{isEditing ? "Edit Post" : posting.postingName}</h1>
          </header>

          <div className={styles.postingContent}>
            <img
              src={postingImageUrl}
              alt={posting.postingName}
              className={styles.postingImage}
            />
            <div className={isEditing ? styles.editModeContainer : styles.postingDetails}>
              {isEditing ? (
                <>
                  <label>Posting Name:</label>
                  <input
                    type="text"
                    name="postingName"
                    value={updatedData.postingName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Posting Name"
                  />
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={updatedData.description}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Description"
                  />

                  {/* Change Image Field */}
                  <div className={styles.inputGroup}>
                    <label>Change Image:</label>
                    <input
                      type="file"
                      name="postingImage"
                      onChange={handleImageChange}
                      className={styles.inputFile}
                    />
                  </div>
                  
                  {/* Price, Service Type, and Category Fields Side by Side */}
                  <div className={styles.row}>
                    {/* Price Field */}
                    <div className={`${styles.inputGroup} ${styles.priceInputContainer}`}>
                      <label htmlFor="price" className={styles.label}>
                        Price
                      </label>
                      <div className={styles.priceInputContainer}>
                        <span className={styles.dollarSign}>$</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={updatedData.price}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                          min="0"
                          step="any"
                        />
                      </div>
                    </div>

                    {/* Service Type Field */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="serviceType" className={styles.label}>
                        Service Type
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={updatedData.serviceType}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <ServiceOptions />
                      </select>
                    </div>

                    {/* Category Field */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="category" className={styles.label}>
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={updatedData.category}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <CategoryOptions />
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.postingDescription}>{posting.description}</p>
                  <p className={styles.postingPrice}>Price: ${posting.price}</p>
                  <p className={styles.postingType}>
                    {posting.serviceType === "offering" ? "Offering" : "Requesting"}
                  </p>
                  <p className={styles.postingCategory}>Category: {posting.category}</p>
                </>
              )}
              <p className={styles.postingTimestamp}>
                Posted on: {new Date(posting.createdAt).toLocaleString()}
              </p>
              {posting.updatedAt && (
                <p className={styles.postingTimestamp}>
                  Last updated on: {new Date(posting.updatedAt).toLocaleString()}
                </p>
              )}
              <p className={styles.postingUser}>
                Posted by: {user ? `${user.firstName} ${user.lastName}` : "User not found"}
              </p>

              <div className={styles.actionButtons}>
                {isOwner ? (
                  isEditing ? (
                    <>
                      <button onClick={handleSaveChanges} className={styles.saveButton}>
                        Save Changes
                      </button>
                      <button onClick={handleDeletePost} className={styles.deleteButton}>
                        Delete Post
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleEditToggle} className={styles.editButton}>
                        Edit Posting
                      </button>
                      <button onClick={handleDeletePost} className={styles.deleteButton}>
                        Delete Post
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <button className={styles.purchaseButton} onClick={handlePurchase}>
                      Purchase
                    </button>
                    <button className={styles.messageButton} onClick={handleMessage}>
                      Message {user ? `${user.firstName} ${user.lastName}` : "the seller"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SinglePostingPage;
