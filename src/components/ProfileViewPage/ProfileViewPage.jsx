import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, storage, auth } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./ProfileViewPage.module.css";
import Header from "../Layout/Header";
import anonProfile from "../../images/anon_profile.png";
import { PestControlSharp } from "@mui/icons-material";

function ProfileViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [receiverFullName, setReceiverFullName] = useState('');
  const { id: receiverId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    bio: "",
    profileImage: null,
  });
  const [isOwner, setIsOwner] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [requesterProfiles, setRequesterProfiles] = useState([]);


  useEffect(() => {
    const fetchReceiverFullName = async () => {
      try {
        const userDocRef = doc(db, 'profiles', receiverId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const { firstName, lastName } = userDocSnap.data();
          setReceiverFullName(`${firstName} ${lastName}`);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchReceiverFullName();
  }, [receiverId]);

  useEffect(() => {
    const fetchProfileAndData = async () => {
      try {
        const profileRef = doc(db, "profiles", id);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setProfile(profileData);
          setFriendRequests(profileData.friendRequests || []);
          setFriendsList(profileData.friends || []);

          const reviewsQuery = query(
            collection(db, "reviews"),
            where("revieweeId", "==", id)
          );
          const reviewsSnapshot = await getDocs(reviewsQuery);
          const fetchedReviews = reviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(fetchedReviews);

          const currentUser = auth.currentUser;
          setIsOwner(currentUser && currentUser.uid === id);
          setFriendRequestSent(
            profileData.friendRequests?.includes(currentUser.uid)
          );

          const requesterProfiles = await Promise.all(
            (profileData.friendRequests || []).map(async (requesterId) => {
              const requesterDoc = await getDoc(doc(db, "profiles", requesterId));
              return requesterDoc.exists()
                ? { id: requesterId, ...requesterDoc.data() }
                : null;
            })
          );

          setRequesterProfiles(requesterProfiles.filter((profile) => profile !== null));

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

    fetchProfileAndData();
  }, [id]);

  const handleSendFriendRequest = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Please log in to send a friend request.");
        return;
      }

      const currentUserId = currentUser.uid;
      const profileRef = doc(db, "profiles", id);

      await updateDoc(profileRef, {
        friendRequests: arrayUnion(currentUserId),
      });

      setFriendRequestSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleEditToggle = () => {
    if (isOwner) {
      setIsEditing(!isEditing);
    } else {
      alert("You can only edit your own profile.");
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
      profileImage: e.target.files[0],
    }));
  };

  const handleAcceptFriendRequest = async (requesterId) => {
    try {
      const profileRef = doc(db, "profiles", id);
      await updateDoc(profileRef, {
        friends: arrayUnion(requesterId),
        friendRequests: arrayRemove(requesterId),
      });

      const requesterRef = doc(db, "profiles", requesterId);
      await updateDoc(requesterRef, {
        friends: arrayUnion(id),
      });

      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request !== requesterId)
      );

      setFriendsList((prevFriends) => [...prevFriends, requesterId]);
      setRequesterProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== requesterId)
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineFriendRequest = async (requesterId) => {
    try {
      const profileRef = doc(db, "profiles", id);
      await updateDoc(profileRef, {
        friendRequests: arrayRemove(requesterId),
      });

      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request !== requesterId)
      );

      setRequesterProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== requesterId)
      );

    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      let profileImageUrl = profile.profileImageUrl;

      if (updatedData.profileImage) {
        const imageRef = ref(storage, `profileImages/${updatedData.profileImage.name}`);
        await uploadBytes(imageRef, updatedData.profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      const profileRef = doc(db, "profiles", id);
      await updateDoc(profileRef, {
        firstName: updatedData.firstName,
        middleName: updatedData.middleName,
        lastName: updatedData.lastName,
        bio: updatedData.bio,
        profileImageUrl: profileImageUrl,
      });

      setProfile({ ...updatedData, profileImageUrl });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      try {
        const profileRef = doc(db, "profiles", id);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());

          setUpdatedData(profileSnap.data());

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

          const currentUser = auth.currentUser;
          setIsOwner(currentUser && currentUser.uid === id); // Only allow editing if the user is the owner
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

  const handleViewFriendsList = () => {
    navigate(`/friends/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const profileImageUrl = profile.profileImageUrl || anonProfile;
  const starRating = "★".repeat(Math.round(profile.rating)) + "☆".repeat(5 - Math.round(profile.rating));
  const isAlreadyFriends = friendsList.includes(auth.currentUser?.uid);

  return (
    <div>
      <Header />
      <main className={styles.profileDetailPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={updatedData.firstName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="middleName"
                    value={updatedData.middleName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Middle Name"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={updatedData.lastName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Last Name"
                  />
                </>
              ) : (
                `${profile.firstName} ${profile.middleName} ${profile.lastName}`
              )}
            </h1>
            {isOwner && (
              <button onClick={handleEditToggle} className={styles.editButton}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleViewFriendsList}
                className={styles.viewFriendsButton}
              >
                View Friends
              </button>
            )}
            {isOwner && requesterProfiles.length > 0 && (
              <>
                <h3>Friend Requests</h3>
                <ul className={styles.friendRequestsList}>
                  {requesterProfiles.map((requester) => (
                    <li key={requester.id} className={styles.requesterItem}>
                      <div className={styles.requesterDetails}>
                        <h4>{`${requester.firstName} ${requester.lastName}`}</h4>
                        <div className={styles.requesterActions}>
                          <button
                            onClick={() => handleAcceptFriendRequest(requester.id)}
                            className={styles.acceptButton}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineFriendRequest(requester.id)}
                            className={styles.declineButton}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </header>

          <div className={styles.profileContent}>
            <div className={styles.profileSidebar}>
              <img
                src={profileImageUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className={styles.profileImage}
              />
              {isEditing && (
                <div className={styles.inputGroup}>
                  <label>Profile Image</label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleImageChange}
                    className={styles.inputFile}
                  />
                </div>
              )}
              <div className={styles.profileInfo}>
                <div className={styles.rating}>
                  <span>{starRating}</span> ({reviews.length} reviews)
                </div>
                {!isOwner && (
                  <>
                    {isAlreadyFriends ? (
                      <p className={styles.alreadyFriends}>You are already friends.</p>
                    ) : (
                    <button
                      onClick={handleSendFriendRequest} 
                      className={styles.friendButton}
                      disabled={friendRequestSent}
                    >
                      {friendRequestSent ? "Request Sent" : "Send Friend Request"}
                    </button>
                    )}
                    <button className={styles.messageButton} onClick={() => navigate(`/chat/${id}`)}>
                      Send Message
                    </button>
                    <button
                      className={styles.reviewButton}
                      onClick={() =>
                        navigate(`/review/${id}`, {
                          state: { revieweeId: id, revieweeName: `${profile.firstName} ${profile.lastName}` },
                        })
                      }
                    >
                      Leave a Review
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.profileDetails}>
              <h2 className={styles.bioTitle}>Bio</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={updatedData.bio}
                  onChange={handleInputChange}
                  className={styles.textarea}
                />
              ) : (
                <p className={styles.bio}>{profile.bio}</p>
              )}
              
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
                        <p className={styles.reviewerName}>Posted by: {receiverFullName || 'User'} {review.reviewerName}</p>
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

              {isEditing && (
                <button onClick={handleSaveChanges} className={styles.saveButton}>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileViewPage;
